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

const compactQueue = async (item: AddSyncQueueItem) => {
  if (!item.entity || !item.entityId) return

  const existing = await db.syncQueue
    .where('[entity+entityId]')
    .equals([item.entity, item.entityId])
    .toArray()

  if (!existing.length) return

  if (item.method === 'DELETE') {
    await db.syncQueue.bulkDelete(existing.map((entry) => entry.id))
    return
  }

  const pendingCreate = existing.find((entry) => entry.method === 'POST')

  if (pendingCreate && item.method === 'PATCH') {
    await db.syncQueue.update(pendingCreate.id, {
      data: {
        ...(typeof pendingCreate.data === 'object' && pendingCreate.data ? pendingCreate.data : {}),
        ...(typeof item.data === 'object' && item.data ? item.data : {}),
      },
      ts: Date.now(),
    })

    return
  }

  if (item.method === 'PATCH') {
    const pendingUpdate = existing.find((entry) => entry.method === 'PATCH')

    if (pendingUpdate) {
      await db.syncQueue.update(pendingUpdate.id, {
        data: {
          ...(typeof pendingUpdate.data === 'object' && pendingUpdate.data ? pendingUpdate.data : {}),
          ...(typeof item.data === 'object' && item.data ? item.data : {}),
        },
        ts: Date.now(),
      })
    }
  }
}

export const addToSyncQueue = async (req: AddSyncQueueItem) => {
  await compactQueue(req)

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

export const processSyncQueue = async () => {
  if (syncing || !navigator.onLine) return
  syncing = true

  try {
    const queue = await getQueue()

    for (const item of queue) {
      try {
        await api.request({
          method: item.method,
          url: item.url,
          data: item.data,
          headers: {
            'x-ataraxia-sync': 'true',
          },
        })

        await db.syncQueue.delete(item.id)
      } catch (error: any) {
        if (isTransientError(error) && item.retries < MAX_RETRIES) {
          await db.syncQueue.update(item.id, {
            retries: item.retries + 1,
            ts: Date.now(),
          })

          break
        }

        await db.syncQueue.delete(item.id)
      }
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
