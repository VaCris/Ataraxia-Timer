import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import api from '@api/client'
import { db } from '@/infrastructure/database/db'
import { getLocalOwnerId, getSyncCursorStorageKey } from '@/infrastructure/database/localOwner'
import { tasksLocalRepository } from '@/features/tasks/repositories/tasks.local.repository'
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

let nowSeed = 20_000_000
let now = nowSeed

const advanceTime = (ms = 20_000) => {
  now += ms
}

const putSyncedTask = async (id: string, title: string) => {
  const ownerId = getLocalOwnerId()
  await db.tasks.put({
    id,
    ownerId,
    userId: 'sync-test-user',
    title,
    status: 'TODO',
    syncStatus: 'synced',
    updatedAt: Date.now(),
    deletedAt: null,
  })
  return ownerId
}

describe('syncManager idempotency and conflicts', () => {
  beforeEach(async () => {
    nowSeed += 1_000_000
    now = nowSeed
    vi.spyOn(Date, 'now').mockImplementation(() => now)

    localStorage.clear()
    localStorage.setItem('ataraxia_local_profile', JSON.stringify({
      id: 'sync-test-user',
      name: 'Sync Test User',
    }))
    setOnline(true)

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

  it('reuses the same clientMutationId across retries and accepts an ignored duplicate as reconciled', async () => {
    localStorage.setItem('token', 'remote-token')
    const ownerId = await putSyncedTask('task-idempotent', 'Idempotent task')

    await db.tasks.update('task-idempotent', { syncStatus: 'pending_update' })
    await addToSyncQueue({
      method: 'PATCH',
      url: '/tasks/task-idempotent',
      entity: 'tasks',
      entityId: 'task-idempotent',
      data: { title: 'Idempotent task updated' },
    })

    const queued = await db.syncQueue.where('ownerId').equals(ownerId).first()
    if (!queued) throw new Error('Expected queued mutation')

    const pushMock = vi.mocked(SyncControllerService.push)
    pushMock.mockRejectedValueOnce({ response: { status: 500 }, message: 'Temporary failure' } as never)

    await processSyncQueue()

    const retained = await db.syncQueue.get(queued.id)
    expect(retained?.status).toBe('retrying')
    expect(pushMock.mock.calls[0]?.[0].mutations[0]?.clientMutationId).toBe(queued.id)

    now = (retained?.nextRetryAt ?? now) + 10_000
    pushMock.mockReturnValueOnce(Promise.resolve({
      applied: [],
      conflicts: [],
      ignored: [queued.id],
      nextCursor: 'cursor-idempotent',
    }) as unknown as ReturnType<typeof SyncControllerService.push>)

    await processSyncQueue()

    expect(pushMock.mock.calls[1]?.[0].mutations[0]?.clientMutationId).toBe(queued.id)
    expect(await db.syncQueue.get(queued.id)).toBeUndefined()
    expect((await db.tasks.get('task-idempotent'))?.syncStatus).toBe('synced')
    expect(localStorage.getItem(getSyncCursorStorageKey(ownerId))).toBe('cursor-idempotent')
  })

  it('reconciles create, update and delete mutations made offline after reconnecting', async () => {
    setOnline(false)

    const created = await tasksLocalRepository.create({ title: 'Created offline' })
    await addToSyncQueue({
      method: 'POST',
      url: '/tasks',
      entity: 'tasks',
      entityId: created.id,
      data: { title: 'Created offline' },
    })

    await tasksLocalRepository.update(created.id, { title: 'Created then edited offline' })
    await addToSyncQueue({
      method: 'PATCH',
      url: `/tasks/${created.id}`,
      entity: 'tasks',
      entityId: created.id,
      data: { title: 'Created then edited offline' },
    })

    await putSyncedTask('task-update-offline', 'Before offline update')
    await tasksLocalRepository.update('task-update-offline', { title: 'Updated offline' })
    await addToSyncQueue({
      method: 'PATCH',
      url: '/tasks/task-update-offline',
      entity: 'tasks',
      entityId: 'task-update-offline',
      data: { title: 'Updated offline' },
    })

    await putSyncedTask('task-delete-offline', 'Delete offline')
    const shouldSyncDelete = await tasksLocalRepository.remove('task-delete-offline')
    expect(shouldSyncDelete).toBe(true)
    await addToSyncQueue({
      method: 'DELETE',
      url: '/tasks/task-delete-offline',
      entity: 'tasks',
      entityId: 'task-delete-offline',
    })

    const queue = await db.syncQueue.orderBy('ts').toArray()
    expect(queue).toHaveLength(3)

    const createMutation = queue.find((item) => item.entityId === created.id)
    expect(createMutation?.method).toBe('POST')
    expect(createMutation?.data).toMatchObject({ title: 'Created then edited offline' })

    vi.mocked(SyncControllerService.push).mockReturnValueOnce(Promise.resolve({
      applied: queue.map((item) => item.id),
      conflicts: [],
      ignored: [],
      nextCursor: 'cursor-offline-crud',
    }) as unknown as ReturnType<typeof SyncControllerService.push>)

    setOnline(true)
    localStorage.setItem('token', 'remote-token')
    advanceTime()
    await processSyncQueue()

    expect(await db.syncQueue.count()).toBe(0)
    expect((await db.tasks.get(created.id))?.title).toBe('Created then edited offline')
    expect((await db.tasks.get(created.id))?.syncStatus).toBe('synced')
    expect((await db.tasks.get('task-update-offline'))?.title).toBe('Updated offline')
    expect((await db.tasks.get('task-update-offline'))?.syncStatus).toBe('synced')
    expect(await db.tasks.get('task-delete-offline')).toBeUndefined()
  })

  it('preserves a local pending edit and marks a conflict when a second client changes the same entity', async () => {
    localStorage.setItem('token', 'remote-token')
    const ownerId = await putSyncedTask('task-concurrent', 'Original title')

    await tasksLocalRepository.update('task-concurrent', { title: 'Local edit' })
    await addToSyncQueue({
      method: 'PATCH',
      url: '/tasks/task-concurrent',
      entity: 'tasks',
      entityId: 'task-concurrent',
      data: { title: 'Local edit' },
    })

    const queued = await db.syncQueue.where('ownerId').equals(ownerId).first()
    if (!queued) throw new Error('Expected queued mutation')

    vi.mocked(SyncControllerService.push).mockRejectedValueOnce({
      response: { status: 500 },
      message: 'Push interrupted',
    } as never)

    vi.mocked(api.get).mockResolvedValueOnce({
      data: {
        changes: [{
          entityType: 'tasks',
          entityId: 'task-concurrent',
          operation: 'UPDATE',
          payload: { title: 'Remote edit', status: 'DONE' },
        }],
        nextCursor: 'cursor-from-second-client',
      },
    } as never)

    await processSyncQueue()

    const conflicted = await db.syncQueue.get(queued.id)
    expect(conflicted?.status).toBe('conflict')
    expect((await db.tasks.get('task-concurrent'))?.title).toBe('Local edit')
    expect((await db.tasks.get('task-concurrent'))?.syncStatus).toBe('pending_update')
    expect(localStorage.getItem(getSyncCursorStorageKey(ownerId))).toBeNull()
  })

  it('advances the pull cursor only after the remote change is persisted and can resume after an interrupted apply', async () => {
    localStorage.setItem('token', 'remote-token')
    const ownerId = getLocalOwnerId()
    const cursorKey = getSyncCursorStorageKey(ownerId)

    vi.mocked(api.get).mockResolvedValue({
      data: {
        changes: [{
          entityType: 'tasks',
          entityId: 'task-from-remote',
          operation: 'UPDATE',
          payload: { title: 'Remote persisted task', status: 'TODO' },
        }],
        nextCursor: 'cursor-after-persist',
      },
    } as never)

    vi.spyOn(db.tasks, 'put').mockRejectedValueOnce(new Error('IndexedDB write interrupted'))

    await processSyncQueue()

    expect(await db.tasks.get('task-from-remote')).toBeUndefined()
    expect(localStorage.getItem(cursorKey)).toBeNull()

    advanceTime(20_000)
    await processSyncQueue()

    expect((await db.tasks.get('task-from-remote'))?.title).toBe('Remote persisted task')
    expect((await db.tasks.get('task-from-remote'))?.syncStatus).toBe('synced')
    expect(localStorage.getItem(cursorKey)).toBe('cursor-after-persist')
  })
})
