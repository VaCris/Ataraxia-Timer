import type { Table } from 'dexie'
import api from '@api/client'
import { db, SyncQueueItem, SyncQueueStatus } from '@/infrastructure/database/db'
import { ensureCurrentOwnerData } from '@/infrastructure/database/ownerMigration'
import { getSyncCursorStorageKey } from '@/infrastructure/database/localOwner'
import type { SyncMutationRequestDto } from '@/infrastructure/api/generated/models/SyncMutationRequestDto'
import type { SyncPullResponseDto } from '@/infrastructure/api/generated/models/SyncPullResponseDto'
import type { SyncPushResponseDto } from '@/infrastructure/api/generated/models/SyncPushResponseDto'

type SyncMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type ErrorLike = {
  status?: number
  code?: string
  message?: string
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
}

type SyncRecord = {
  id?: string
  ownerId?: string
  syncStatus?: string
  updatedAt?: number
  deletedAt?: number | null
  [key: string]: unknown
}

export type AddSyncQueueItem = {
  method: SyncMethod
  url: string
  data?: unknown
  entity?: 'tasks' | 'settings' | 'tags'
  entityId?: string
}

let syncing = false
const BASE_RETRY_MS = 2_000
const MAX_RETRY_MS = 5 * 60_000

const toErrorLike = (error: unknown): ErrorLike =>
  typeof error === 'object' && error !== null ? error as ErrorLike : {}

const mergeData = (a: unknown, b: unknown) => ({
  ...(typeof a === 'object' && a ? a : {}),
  ...(typeof b === 'object' && b ? b : {}),
})

const compactQueue = async (item: AddSyncQueueItem, ownerId: string): Promise<boolean> => {
  if (!item.entity || !item.entityId) return false

  const existing = await db.syncQueue
    .where('[entity+entityId]')
    .equals([item.entity, item.entityId])
    .filter((entry) => entry.ownerId === ownerId)
    .toArray()

  if (!existing.length) return false

  if (item.method === 'DELETE') {
    await db.syncQueue.bulkDelete(existing.map((entry) => entry.id))
    return false
  }

  const pendingCreate = existing.find((entry) => entry.method === 'POST')
  if (pendingCreate && item.method === 'PATCH') {
    await db.syncQueue.update(pendingCreate.id, {
      data: mergeData(pendingCreate.data, item.data),
      ts: Date.now(),
      status: 'pending',
      lastError: undefined,
      nextRetryAt: undefined,
    })
    return true
  }

  if (item.method === 'PATCH') {
    const pendingUpdate = existing.find((entry) => entry.method === 'PATCH')
    if (pendingUpdate) {
      await db.syncQueue.update(pendingUpdate.id, {
        data: mergeData(pendingUpdate.data, item.data),
        ts: Date.now(),
        status: 'pending',
        lastError: undefined,
        nextRetryAt: undefined,
      })
      return true
    }
  }

  return false
}

export const addToSyncQueue = async (req: AddSyncQueueItem) => {
  const ownerId = await ensureCurrentOwnerData()
  const absorbed = await compactQueue(req, ownerId)
  if (absorbed) return

  if (req.entity && req.entityId) {
    const existing = await db.syncQueue
      .where('[entity+entityId]')
      .equals([req.entity, req.entityId])
      .filter((item) => item.ownerId === ownerId)
      .toArray()

    if (existing.some((item) => item.method === req.method && item.status !== 'failed_permanent')) {
      return
    }
  }

  const item: SyncQueueItem = {
    ...req,
    id: crypto.randomUUID(),
    ownerId,
    retries: 0,
    ts: Date.now(),
    status: 'pending',
  }

  await db.syncQueue.put(item)
}

const getReadyQueue = async (ownerId: string) => {
  const now = Date.now()
  const queue = await db.syncQueue
    .where('ownerId')
    .equals(ownerId)
    .sortBy('ts')

  return queue.filter((item) => {
    if (item.status === 'failed_permanent' || item.status === 'conflict') return false
    if (item.status === 'blocked_auth') return true
    return !item.nextRetryAt || item.nextRetryAt <= now
  })
}

export const getSyncBackoffMs = (retries: number) => {
  const exponential = Math.min(MAX_RETRY_MS, BASE_RETRY_MS * 2 ** Math.max(0, retries - 1))
  const jitter = Math.floor(Math.random() * Math.min(1_000, exponential * 0.2))
  return exponential + jitter
}

const errorMessage = (error: unknown) => {
  const candidate = toErrorLike(error)
  return candidate.response?.data?.message || candidate.message || 'Unknown synchronization error'
}

export const classifySyncError = (error: unknown): SyncQueueStatus => {
  const candidate = toErrorLike(error)
  const status = candidate.status || candidate.response?.status

  if (status === 401 || status === 403) return 'blocked_auth'
  if (status === 409) return 'conflict'
  if (status === 408 || status === 429 || (typeof status === 'number' && status >= 500) || candidate.code === 'ERR_NETWORK' || candidate.message === 'Network Error') {
    return 'retrying'
  }

  return 'failed_permanent'
}

const markQueueFailure = async (queue: SyncQueueItem[], error: unknown) => {
  const status = classifySyncError(error)
  const message = errorMessage(error)

  for (const item of queue) {
    if (status === 'blocked_auth') {
      await db.syncQueue.update(item.id, {
        status,
        lastError: message,
        nextRetryAt: undefined,
      })
      continue
    }

    if (status === 'conflict' || status === 'failed_permanent') {
      await db.syncQueue.update(item.id, {
        status,
        lastError: message,
        nextRetryAt: undefined,
      })
      continue
    }

    const retries = (item.retries || 0) + 1
    await db.syncQueue.update(item.id, {
      status: 'retrying',
      retries,
      lastError: message,
      nextRetryAt: Date.now() + getSyncBackoffMs(retries),
    })
  }
}

const markEntityConflict = async (entity: string, entityId: string, ownerId: string) => {
  const pending = await db.syncQueue
    .where('[entity+entityId]')
    .equals([entity, entityId])
    .filter((item) => item.ownerId === ownerId)
    .toArray()

  for (const item of pending) {
    await db.syncQueue.update(item.id, {
      status: 'conflict',
      lastError: 'Remote change conflicts with an unsynced local change.',
      nextRetryAt: undefined,
    })
  }
}

const markLocalMutationSynced = async (item: SyncQueueItem) => {
  if (!item.entity || !item.entityId) return

  if (item.entity === 'tasks') {
    const task = await db.tasks.get(item.entityId)
    if (!task || task.ownerId !== item.ownerId) return

    if (item.method === 'DELETE') {
      await db.tasks.delete(item.entityId)
      return
    }

    await db.tasks.put({
      ...task,
      syncStatus: 'synced',
      updatedAt: Date.now(),
      deletedAt: null,
    })
    return
  }

  if (item.entity === 'tags') {
    const tag = await db.tags.get(item.entityId)
    if (!tag || tag.ownerId !== item.ownerId) return

    if (item.method === 'DELETE') {
      await db.tags.delete(item.entityId)
      return
    }

    await db.tags.put({
      ...tag,
      syncStatus: 'synced',
      updatedAt: Date.now(),
      deletedAt: null,
    })
    return
  }

  if (item.entity === 'settings') {
    const settings = await db.settings.get(item.entityId)
    if (settings) {
      await db.settings.put({
        ...settings,
        syncStatus: 'synced',
        updatedAt: Date.now(),
      })
    }
  }
}

const reconcilePushResult = async (
  queue: SyncQueueItem[],
  result: SyncPushResponseDto,
  ownerId: string
) => {
  const applied = new Set(result.applied || [])
  const ignored = new Set(result.ignored || [])
  const conflicts = new Set(result.conflicts || [])
  const hasDetailedResult = applied.size > 0 || ignored.size > 0 || conflicts.size > 0

  for (const item of queue) {
    if (conflicts.has(item.id)) {
      await db.syncQueue.update(item.id, {
        status: 'conflict',
        lastError: 'Server reported a synchronization conflict.',
        nextRetryAt: undefined,
      })
      continue
    }

    const wasAccepted = !hasDetailedResult || applied.has(item.id) || ignored.has(item.id)
    if (!wasAccepted) continue

    await markLocalMutationSynced(item)
    await db.syncQueue.delete(item.id)
  }

  if (conflicts.size === 0 && result.nextCursor) {
    localStorage.setItem(getSyncCursorStorageKey(ownerId), result.nextCursor)
  }
}

const unblockAuthenticatedItems = async (ownerId: string) => {
  const blocked = await db.syncQueue
    .where('ownerId')
    .equals(ownerId)
    .filter((item) => item.status === 'blocked_auth')
    .toArray()
  if (!blocked.length) return

  for (const item of blocked) {
    await db.syncQueue.update(item.id, {
      status: 'pending',
      lastError: undefined,
      nextRetryAt: undefined,
    })
  }
}

const getSyncTable = (entityType: string): Table<SyncRecord, string> | null => {
  if (entityType === 'tasks') return db.tasks as unknown as Table<SyncRecord, string>
  if (entityType === 'settings') return db.settings as unknown as Table<SyncRecord, string>
  if (entityType === 'tags') return db.tags as unknown as Table<SyncRecord, string>
  return null
}

let lastSyncTime = 0
let lastPullTime = 0
const SYNC_COOLDOWN_MS = 5_000
const PULL_THROTTLE_MS = 15_000

export const processSyncQueue = async () => {
  if (syncing || !navigator.onLine) return

  const token = localStorage.getItem('token')
  if (!token) return

  const now = Date.now()
  if (now - lastSyncTime < SYNC_COOLDOWN_MS) return

  syncing = true
  lastSyncTime = now

  try {
    const ownerId = await ensureCurrentOwnerData()
    await unblockAuthenticatedItems(ownerId)
    const queue = await getReadyQueue(ownerId)

    if (queue.length > 0) {
      const mutations: SyncMutationRequestDto[] = queue.map((item) => {
        let operation = 'UPDATE'
        if (item.method === 'POST') operation = 'CREATE'
        else if (item.method === 'DELETE') operation = 'DELETE'

        return {
          clientMutationId: item.id,
          entityType: item.entity || 'unknown',
          entityId: item.entityId || '',
          operation,
          payload: item.data as SyncMutationRequestDto['payload'],
        }
      })

      try {
        const { SyncControllerService } = await import('@/infrastructure/api/generated')
        const result = await SyncControllerService.push({ mutations })
        await reconcilePushResult(queue, result, ownerId)
      } catch (error: unknown) {
        await markQueueFailure(queue, error)
      }
    }

    const shouldPull = queue.length > 0 || now - lastPullTime >= PULL_THROTTLE_MS
    if (!shouldPull) return

    lastPullTime = now

    try {
      const cursorKey = getSyncCursorStorageKey(ownerId)
      const lastSync = localStorage.getItem(cursorKey) || undefined
      const params = new URLSearchParams()
      if (lastSync) params.set('cursor', lastSync)
      params.set('limit', '100')
      params.set('entityTypes', 'tasks,settings,tags')

      const { data: response } = await api.get<SyncPullResponseDto>(`/sync/pull?${params.toString()}`)
      let applyFailed = false
      let conflictDetected = false

      if (response.changes?.length) {
        for (const change of response.changes) {
          if (!change.entityId || !change.entityType) continue

          const table = getSyncTable(change.entityType)
          if (!table) continue

          try {
            const isOwnedEntity = change.entityType === 'tasks' || change.entityType === 'tags'

            if (change.operation === 'DELETE') {
              const existingPending = await table.get(change.entityId)
              if (isOwnedEntity && existingPending?.ownerId && existingPending.ownerId !== ownerId) {
                continue
              }
              if (existingPending?.syncStatus && existingPending.syncStatus !== 'synced') {
                conflictDetected = true
                await markEntityConflict(change.entityType, change.entityId, ownerId)
                continue
              }

              await table.delete(change.entityId)
              continue
            }

            if (change.payload) {
              const existingPending = await table.get(change.entityId)
              if (isOwnedEntity && existingPending?.ownerId && existingPending.ownerId !== ownerId) {
                applyFailed = true
                console.warn(`Skipped cross-owner storage collision for ${change.entityType}/${change.entityId}.`)
                continue
              }
              if (existingPending?.syncStatus && existingPending.syncStatus !== 'synced') {
                conflictDetected = true
                await markEntityConflict(change.entityType, change.entityId, ownerId)
                continue
              }

              const base = change.entityType === 'settings'
                ? { syncStatus: 'synced', updatedAt: Date.now() }
                : { ownerId, syncStatus: 'synced', updatedAt: Date.now(), deletedAt: null }

              await table.put({
                ...(change.payload as Record<string, unknown>),
                ...base,
                id: change.entityId,
              })
            }
          } catch (error: unknown) {
            applyFailed = true
            console.error(`Error applying change for ${change.entityType}/${change.entityId}:`, error)
          }
        }
      }

      if (!applyFailed && !conflictDetected && response.nextCursor) {
        localStorage.setItem(cursorKey, response.nextCursor)
      }
    } catch (error: unknown) {
      const candidate = toErrorLike(error)
      const status = candidate.status || candidate.response?.status

      if (status === 401 || status === 403) {
        console.warn('Sync pull is waiting for a valid remote session.')
      } else {
        console.error('Error pulling updates:', error)
      }
    }
  } finally {
    syncing = false
  }
}

export const clearSyncQueue = async () => {
  const ownerId = await ensureCurrentOwnerData()
  await db.syncQueue.where('ownerId').equals(ownerId).delete()
}

export const getSyncQueueSize = async (): Promise<number> => {
  const ownerId = await ensureCurrentOwnerData()
  return db.syncQueue.where('ownerId').equals(ownerId).count()
}

export const getSyncQueueFailures = async (): Promise<SyncQueueItem[]> => {
  const ownerId = await ensureCurrentOwnerData()
  return db.syncQueue
    .where('ownerId')
    .equals(ownerId)
    .filter((item) => item.status === 'conflict' || item.status === 'failed_permanent')
    .toArray()
}

export const retrySyncItem = async (id: string): Promise<void> => {
  const ownerId = await ensureCurrentOwnerData()
  const item = await db.syncQueue.get(id)
  if (!item || item.ownerId !== ownerId) return

  await db.syncQueue.update(id, {
    status: 'pending',
    retries: 0,
    lastError: undefined,
    nextRetryAt: undefined,
  })

  if (navigator.onLine) await processSyncQueue()
}

export const initSyncListener = () => {
  window.addEventListener('online', () => {
    processSyncQueue()
  })

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      processSyncQueue()
    }
  })
}
