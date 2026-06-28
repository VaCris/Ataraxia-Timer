import api from '@api/client'
import { db, SyncQueueItem } from '@/infrastructure/database/db'

type SyncMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type AddSyncQueueItem = {
  method: SyncMethod
  url: string
  data?: unknown
  entity?: 'tasks' | 'settings'
  entityId?: string
}

const MAX_RETRIES = 5
let syncing = false

const isTransientError = (error: any) => {
  if (error.code === 'ERR_NETWORK') return true
  if (error.message === 'Network Error') return true

  const status = error.response?.status
  return status >= 500 || status === 408 || status === 429
}

const mergeData = (a: unknown, b: unknown) => ({
  ...(typeof a === 'object' && a ? a : {}),
  ...(typeof b === 'object' && b ? b : {}),
})

const compactQueue = async (item: AddSyncQueueItem): Promise<boolean> => {
  if (!item.entity || !item.entityId) return false

  const existing = await db.syncQueue
    .where('[entity+entityId]')
    .equals([item.entity, item.entityId])
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
    })

    return true
  }

  if (item.method === 'PATCH') {
    const pendingUpdate = existing.find((entry) => entry.method === 'PATCH')

    if (pendingUpdate) {
      await db.syncQueue.update(pendingUpdate.id, {
        data: mergeData(pendingUpdate.data, item.data),
        ts: Date.now(),
      })

      return true
    }
  }

  return false
}

export const addToSyncQueue = async (req: AddSyncQueueItem) => {
  const absorbed = await compactQueue(req)
  if (absorbed) return

  if (req.entity && req.entityId) {
    const existing = await db.syncQueue
      .where('[entity+entityId]')
      .equals([req.entity, req.entityId])
      .toArray()

    if (existing.some((item) => item.method === req.method)) return
  }

  const item: SyncQueueItem = {
    ...req,
    id: crypto.randomUUID(),
    retries: 0,
    ts: Date.now(),
  }

  await db.syncQueue.put(item)
}

const getQueue = () => db.syncQueue.orderBy('ts').toArray()

const applySyncedEntity = async (item: SyncQueueItem, responseData: any) => {
  if (item.entity !== 'tasks') return

  if (item.method === 'DELETE' && item.entityId) {
    await db.tasks.delete(item.entityId)
    return
  }

  if (!responseData?.id) return

  if (item.method === 'POST' && item.entityId && item.entityId !== responseData.id) {
    await db.tasks.delete(item.entityId)
  }

  await db.tasks.put({
    ...responseData,
    syncStatus: 'synced',
    updatedAt: Date.now(),
    deletedAt: null,
  })
}

let lastSyncTime = 0
const SYNC_COOLDOWN_MS = 5000 // 5 seconds cooldown

export const processSyncQueue = async () => {
  if (syncing || !navigator.onLine) return
  
  const now = Date.now()
  if (now - lastSyncTime < SYNC_COOLDOWN_MS) return
  
  syncing = true
  lastSyncTime = now

  try {
    const queue = await getQueue()

    if (queue.length > 0) {
      const mutations = queue.map(item => {
        let operation = 'UPDATE'
        if (item.method === 'POST') operation = 'CREATE'
        else if (item.method === 'DELETE') operation = 'DELETE'
        else if (item.method === 'PATCH' || item.method === 'PUT') operation = 'UPDATE'

        return {
          clientMutationId: item.id,
          entityType: item.entity || 'unknown',
          entityId: item.entityId || '',
          operation,
          payload: item.data as any
        }
      })

      try {
        const { SyncControllerService } = await import('@/infrastructure/api/generated')
        await SyncControllerService.push({ mutations })

        for (const item of queue) {
          await db.syncQueue.delete(item.id)
        }
      } catch (error: any) {
        console.error('Error pushing mutations:', error)
      }
    }

    // Now pull updates
    try {
      const { SyncControllerService } = await import('@/infrastructure/api/generated')
      const lastSync = localStorage.getItem('ataraxia_lastSyncCursor') || undefined
      const response = await SyncControllerService.pull(
        lastSync,
        100,
        undefined,
        ['tasks', 'settings', 'tags']
      )

      if (response.changes && response.changes.length > 0) {
        for (const change of response.changes) {
          if (!change.entityId || !change.entityType) continue

          const storeName = change.entityType as keyof AppDB

          if (!db[storeName]) continue
          
          const table = db[storeName] as any

          if (change.operation === 'DELETE') {
            await table.delete(change.entityId)
          } else if (change.payload) {
            await table.put({
              ...change.payload,
              syncStatus: 'synced',
              updatedAt: Date.now(),
              deletedAt: null
            })
          }
        }
      }

      if (response.nextCursor) {
        localStorage.setItem('ataraxia_lastSyncCursor', response.nextCursor)
      }
    } catch (error) {
      console.error('Error pulling updates:', error)
    }

  } finally {
    syncing = false
  }
}

export const clearSyncQueue = async () => {
  await db.syncQueue.clear()
}

export const getSyncQueueSize = async (): Promise<number> => {
  return db.syncQueue.count()
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
