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

describe('syncManager blocked authentication', () => {
  let now = 50_000_000

  beforeEach(async () => {
    now += 1_000_000
    vi.spyOn(Date, 'now').mockImplementation(() => now)
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })

    localStorage.clear()
    localStorage.setItem('ataraxia_local_profile', JSON.stringify({
      id: 'sync-auth-user',
      name: 'Sync Auth User',
    }))
    localStorage.setItem('token', 'stale-token')

    if (!db.isOpen()) await db.open()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
    ])

    vi.mocked(SyncControllerService.push).mockReset()
    vi.mocked(api.get).mockReset()
    vi.mocked(api.get).mockResolvedValue({ data: { changes: [] } } as never)
  })

  afterEach(async () => {
    localStorage.clear()
    await db.syncQueue.clear()
    vi.restoreAllMocks()
  })

  it('does not retry a 401-blocked mutation with the rejected access token', async () => {
    await addToSyncQueue({
      method: 'POST',
      url: '/tasks',
      entity: 'tasks',
      entityId: 'task-auth-block',
      data: { title: 'Blocked task' },
    })

    const pushMock = vi.mocked(SyncControllerService.push)
    pushMock.mockRejectedValue({ response: { status: 401 }, message: 'Unauthorized' } as never)

    await processSyncQueue()

    const [blocked] = await db.syncQueue.toArray()
    expect(blocked.status).toBe('blocked_auth')
    expect(localStorage.getItem('token')).toBeNull()

    now += 60_000
    await processSyncQueue()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect((await db.syncQueue.get(blocked.id))?.status).toBe('blocked_auth')
  })
})
