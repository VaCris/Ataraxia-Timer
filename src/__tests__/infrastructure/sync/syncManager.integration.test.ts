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

let nowSeed = 1_000_000
let now = nowSeed

const advanceTime = (ms = 10_000) => {
  now += ms
}

const queueTask = async (taskId: string) => {
  const ownerId = getLocalOwnerId()

  await db.tasks.put({
    id: taskId,
    ownerId,
    userId: 'sync-test-user',
    title: `Task ${taskId}`,
    status: 'TODO',
    syncStatus: 'pending_create',
    updatedAt: Date.now(),
    deletedAt: null,
  })

  await addToSyncQueue({
    method: 'POST',
    url: '/tasks',
    data: { id: taskId, title: `Task ${taskId}`, status: 'TODO' },
    entity: 'tasks',
    entityId: taskId,
  })

  const queued = await db.syncQueue.where('ownerId').equals(ownerId).first()
  if (!queued) throw new Error('Expected queued sync mutation')

  return { ownerId, queued }
}

const resolvePush = (queueId: string) => {
  vi.mocked(SyncControllerService.push).mockReturnValueOnce(Promise.resolve({
    applied: [queueId],
    conflicts: [],
    ignored: [],
    nextCursor: 'cursor-after-push',
  }) as unknown as ReturnType<typeof SyncControllerService.push>)
}

describe('syncManager integration', () => {
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
      data: { changes: [], nextCursor: 'cursor-after-push' },
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

  it('keeps a local mutation queued through prolonged offline use, database reopen and later reconnection', async () => {
    setOnline(false)
    const { ownerId, queued } = await queueTask('task-offline-1')

    await processSyncQueue()
    expect(await db.syncQueue.count()).toBe(1)

    db.close()
    await db.open()

    const queuedAfterReopen = await db.syncQueue.get(queued.id)
    expect(queuedAfterReopen?.ownerId).toBe(ownerId)
    expect(queuedAfterReopen?.status).toBe('pending')

    resolvePush(queued.id)
    setOnline(true)
    localStorage.setItem('token', 'remote-token')
    advanceTime()

    await processSyncQueue()

    expect(vi.mocked(SyncControllerService.push)).toHaveBeenCalledTimes(1)
    expect(await db.syncQueue.count()).toBe(0)
    expect((await db.tasks.get('task-offline-1'))?.syncStatus).toBe('synced')
    expect(localStorage.getItem(getSyncCursorStorageKey(ownerId))).toBe('cursor-after-push')
    expect(localStorage.getItem('ataraxia_lastSyncCursor')).toBeNull()
  })

  it('never deletes a mutation after repeated HTTP 500 failures', async () => {
    localStorage.setItem('token', 'remote-token')
    const { queued } = await queueTask('task-500')
    const pushMock = vi.mocked(SyncControllerService.push)
    pushMock.mockRejectedValue({ response: { status: 500 }, message: 'Server unavailable' } as never)

    for (let attempt = 1; attempt <= 6; attempt += 1) {
      await processSyncQueue()

      const retained = await db.syncQueue.get(queued.id)
      expect(retained).toBeDefined()
      expect(retained?.status).toBe('retrying')
      expect(retained?.retries).toBe(attempt)
      expect(retained?.lastError).toBe('Server unavailable')
      expect(retained?.nextRetryAt).toBeGreaterThan(now)

      now = (retained?.nextRetryAt ?? now) + 6_000
    }

    expect(await db.syncQueue.count()).toBe(1)
  })

  it('retains a rate-limited mutation and removes it only after a later successful retry', async () => {
    localStorage.setItem('token', 'remote-token')
    const { queued } = await queueTask('task-429')
    const pushMock = vi.mocked(SyncControllerService.push)

    pushMock.mockRejectedValueOnce({ response: { status: 429 }, message: 'Rate limited' } as never)
    await processSyncQueue()

    const retained = await db.syncQueue.get(queued.id)
    expect(retained?.status).toBe('retrying')
    expect(retained?.retries).toBe(1)

    now = (retained?.nextRetryAt ?? now) + 6_000
    resolvePush(queued.id)
    await processSyncQueue()

    expect(await db.syncQueue.get(queued.id)).toBeUndefined()
  })

  it('retains a mutation after a network failure and recovers later', async () => {
    localStorage.setItem('token', 'remote-token')
    const { queued } = await queueTask('task-network')
    const pushMock = vi.mocked(SyncControllerService.push)

    pushMock.mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' } as never)
    await processSyncQueue()

    const retained = await db.syncQueue.get(queued.id)
    expect(retained?.status).toBe('retrying')
    expect(retained?.retries).toBe(1)

    now = (retained?.nextRetryAt ?? now) + 6_000
    resolvePush(queued.id)
    await processSyncQueue()

    expect(await db.syncQueue.get(queued.id)).toBeUndefined()
  })

  it('blocks a mutation on 401 without consuming it and retries after credentials are restored', async () => {
    localStorage.setItem('token', 'stale-token')
    const { queued } = await queueTask('task-401')
    const pushMock = vi.mocked(SyncControllerService.push)

    pushMock.mockRejectedValueOnce({ response: { status: 401 }, message: 'Unauthorized' } as never)
    await processSyncQueue()

    const blocked = await db.syncQueue.get(queued.id)
    expect(blocked?.status).toBe('blocked_auth')
    expect(blocked?.retries).toBe(0)
    expect(blocked?.lastError).toBe('Unauthorized')

    localStorage.removeItem('token')
    advanceTime()
    await processSyncQueue()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect((await db.syncQueue.get(queued.id))?.status).toBe('blocked_auth')

    localStorage.setItem('token', 'fresh-token')
    advanceTime()
    resolvePush(queued.id)
    await processSyncQueue()

    expect(await db.syncQueue.get(queued.id)).toBeUndefined()
  })

  it('keeps permanent failures visible instead of silently deleting them', async () => {
    localStorage.setItem('token', 'remote-token')
    const { queued } = await queueTask('task-422')
    const pushMock = vi.mocked(SyncControllerService.push)

    pushMock.mockRejectedValueOnce({ response: { status: 422 }, message: 'Validation failed' } as never)
    await processSyncQueue()

    const retained = await db.syncQueue.get(queued.id)
    expect(retained?.status).toBe('failed_permanent')
    expect(retained?.lastError).toBe('Validation failed')
    expect(retained?.retries).toBe(0)

    advanceTime()
    resolvePush(queued.id)
    await processSyncQueue()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect((await db.syncQueue.get(queued.id))?.status).toBe('failed_permanent')
  })
})
