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

describe('syncManager partial acknowledgement', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('ataraxia_local_profile', JSON.stringify({
      id: 'sync-partial-user',
      name: 'Sync Partial User',
    }))
    localStorage.setItem('token', 'remote-token')

    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    })

    if (!db.isOpen()) await db.open()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
    ])

    vi.mocked(SyncControllerService.push).mockReset()
    vi.mocked(api.get).mockReset()
    vi.mocked(api.get).mockResolvedValue({
      data: { changes: [], nextCursor: undefined },
    } as never)
  })

  afterEach(async () => {
    if (!db.isOpen()) await db.open()
    localStorage.clear()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
    ])
    vi.restoreAllMocks()
  })

  it('does not advance the cursor while a batch mutation remains unacknowledged', async () => {
    const ownerId = getLocalOwnerId()
    await db.tasks.bulkPut([
      {
        id: 'task-a',
        ownerId,
        userId: 'sync-partial-user',
        title: 'A',
        status: 'TODO',
        syncStatus: 'pending_update',
        updatedAt: Date.now(),
        deletedAt: null,
      },
      {
        id: 'task-b',
        ownerId,
        userId: 'sync-partial-user',
        title: 'B',
        status: 'TODO',
        syncStatus: 'pending_update',
        updatedAt: Date.now(),
        deletedAt: null,
      },
    ])

    await addToSyncQueue({
      method: 'PATCH',
      url: '/tasks/task-a',
      entity: 'tasks',
      entityId: 'task-a',
      data: { title: 'A' },
    })
    await addToSyncQueue({
      method: 'PATCH',
      url: '/tasks/task-b',
      entity: 'tasks',
      entityId: 'task-b',
      data: { title: 'B' },
    })

    const queue = await db.syncQueue.orderBy('ts').toArray()
    expect(queue).toHaveLength(2)

    vi.mocked(SyncControllerService.push).mockReturnValueOnce(Promise.resolve({
      applied: [queue[0].id],
      ignored: [],
      conflicts: [],
      nextCursor: 'cursor-partial',
    }) as unknown as ReturnType<typeof SyncControllerService.push>)

    await processSyncQueue()

    expect(await db.syncQueue.get(queue[0].id)).toBeUndefined()
    expect(await db.syncQueue.get(queue[1].id)).toBeDefined()
    expect((await db.tasks.get('task-a'))?.syncStatus).toBe('synced')
    expect((await db.tasks.get('task-b'))?.syncStatus).toBe('pending_update')
    expect(localStorage.getItem(getSyncCursorStorageKey(ownerId))).toBeNull()
  })
})
