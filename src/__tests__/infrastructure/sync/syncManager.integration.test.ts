import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import api from '@api/client'
import { db } from '@/infrastructure/database/db'
import { getLocalOwnerId, getSyncCursorStorageKey } from '@/infrastructure/database/localOwner'
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
    localStorage.setItem('ataraxia_local_profile', JSON.stringify({
      id: 'sync-test-user',
      name: 'Sync Test User',
    }))
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

  it('keeps a local mutation queued offline and reconciles only the active owner after reconnecting', async () => {
    const taskId = 'task-offline-1'
    const ownerId = getLocalOwnerId()

    await db.tasks.put({
      id: taskId,
      ownerId,
      userId: 'sync-test-user',
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

    const queued = await db.syncQueue.toArray()
    expect(queued).toHaveLength(1)
    expect(queued[0].ownerId).toBe(ownerId)
    expect((await db.tasks.get(taskId))?.syncStatus).toBe('pending_create')

    const pushMock = vi.mocked(SyncControllerService.push)
    pushMock.mockReturnValue(Promise.resolve({
      applied: [queued[0].id],
      conflicts: [],
      ignored: [],
      nextCursor: 'cursor-after-push',
    }) as unknown as ReturnType<typeof SyncControllerService.push>)

    setOnline(true)
    localStorage.setItem('token', 'remote-token')

    await processSyncQueue()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(await db.syncQueue.count()).toBe(0)
    expect((await db.tasks.get(taskId))?.syncStatus).toBe('synced')
    expect(localStorage.getItem(getSyncCursorStorageKey(ownerId))).toBe('cursor-after-push')
    expect(localStorage.getItem('ataraxia_lastSyncCursor')).toBeNull()
  })
})
