import api from './client'
import toast from 'react-hot-toast'

const KEY = 'ataraxia-sync-queue'
let syncing = false

export const addToSyncQueue = (request) => {
  const queue = JSON.parse(localStorage.getItem(KEY) || '[]')
  queue.push(request)
  localStorage.setItem(KEY, JSON.stringify(queue))
}

export const processSyncQueue = async () => {
  if (syncing) return
  syncing = true

  const queue = JSON.parse(localStorage.getItem(KEY) || '[]')
  if (!queue.length) {
    syncing = false
    return
  }

  toast.loading('Synchronizing offline data...', { id: 'sync' })

  const failed = []

  for (const req of queue) {
    try {
      await api.request({ method: req.method, url: req.url, data: req.data })
    } catch (error) {
      if (error.code === 'ERR_NETWORK') failed.push(req)
    }
  }

  localStorage.setItem(KEY, JSON.stringify(failed))

  if (!failed.length) toast.success('Synchronization completed', { id: 'sync' })
  else toast.error('Some items failed to sync', { id: 'sync' })

  syncing = false
}