import api from '@api/client'

type SyncMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE'

type SyncItem = {
  id: string
  method: SyncMethod
  url: string
  data?: unknown
  retries: number
  ts: number
}

const KEY = 'ataraxia-sync-queue'
const MAX_RETRIES = 3
let syncing = false

const loadQueue = (): SyncItem[] =>
  JSON.parse(localStorage.getItem(KEY) || '[]')

const saveQueue = (queue: SyncItem[]) =>
  localStorage.setItem(KEY, JSON.stringify(queue))

export const addToSyncQueue = (req: Omit<SyncItem, 'id' | 'retries' | 'ts'>) => {
  const queue = loadQueue()

  const item: SyncItem = {
    ...req,
    id: crypto.randomUUID(),
    retries: 0,
    ts: Date.now()
  }

  queue.push(item)
  saveQueue(queue)
}

const shouldRetry = (error: any) => {
  if (error.code === 'ERR_NETWORK') return true
  const status = error.response?.status
  return status >= 500
}

export const processSyncQueue = async () => {
  if (syncing) return
  syncing = true

  const queue = loadQueue()
  if (!queue.length) {
    syncing = false
    return
  }

  const failed: SyncItem[] = []

  for (const item of queue) {
    try {
      await api.request({
        method: item.method,
        url: item.url,
        data: item.data
      })
    } catch (e: any) {
      if (shouldRetry(e) && item.retries < MAX_RETRIES) {
        failed.push({
          ...item,
          retries: item.retries + 1
        })
      }
    }
  }

  saveQueue(failed)
  syncing = false
}

export const clearSyncQueue = () => {
  localStorage.removeItem(KEY)
}

export const getSyncQueueSize = (): number => {
  return loadQueue().length
}

export const initSyncListener = () => {
  window.addEventListener('online', () => {
    processSyncQueue()
  })
}