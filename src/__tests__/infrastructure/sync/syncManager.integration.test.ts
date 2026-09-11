import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import api from '@api/client'
import { db } from '@/infrastructure/database/db'
import { addToSyncQueue, processSyncQueue } from '@/infrastructure/sync/syncManager'
import { SyncControllerService } from '@/infrastructure/api/generated'

vi.mock('@api/client', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('@/infrastructure/api/generated', async () => {
  const actual = await vi.importActual<typeof import('@/infrastructure/api/generated')>('@/infrastructure/api/generated')
  return {
    ...actual,
    SyncControllerService: {
      ...actual.SyncControllerService,
      push: vi.fn(),
    },
  }
})

const setOnline = (online: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    value: online,
  })
}

describe('syncManager integration', () => {
  beforeEach(async () => {
    localStorage.clear()
    setOnline(true)
    await db.open()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
    ])

    vi.mocked(api.get).mockResolvedValue({
      data: { changes: [], nextCursor: 'cursor-after-push' },
    } as never)
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    localStorage.clear()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
    ])
  })

  it('keeps a local mutation queued offline and reconciles it after reconnecting', async () => {
    const taskId = 'task-offline-1'

    await db.tasks.put({
      id: taskId,
      title: 'Offline task',
      status: 'TODO',
      syncStatus: 'pending_create',
      updatedAt: Date.now(),
      deletedAt: null,
    })

    setOnline(false)
    await addToSyncQueue({
      method: 'POST',
      url: '/tasks',
      data: { id: taskId, title: 'Offline task', status: 'TODO' },
      entity: 'tasks',
      entityId: taskId,
    })

    await processSyncQueue()

    expect(await db.syncQueue.count()).toBe(1)
    expect((await db.tasks.get(taskId))?.syncStatus).toBe('pending_create')

    const pushMock = vi.mocked(SyncControllerService.push)
    pushMock.mockImplementation(async (request) => ({
      applied: request.mutations?.map((mutation) => mutation.clientMutationId) ?? [],
      conflicts: [],
      ignored: [],
      nextCursor: 'cursor-after-push',
    }))

    setOnline(true)
    localStorage.setItem('token', 'remote-token')

    await processSyncQueue()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(await db.syncQueue.count()).toBe(0)
    expect((await db.tasks.get(taskId))?.syncStatus).toBe('synced')
    expect(localStorage.getItem('ataraxia_lastSyncCursor')).toBe('cursor-after-push')
  })
})
