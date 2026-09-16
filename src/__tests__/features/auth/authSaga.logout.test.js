import 'fake-indexeddb/auto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runSaga, stdChannel } from 'redux-saga'
import authSaga from '@/features/auth/store/authSaga'
import { logoutRequest, logoutSuccess } from '@/features/auth/store/authSlice'
import { db } from '@/infrastructure/database/db'
import {
  getLocalOwnerId,
  getSettingsStorageId,
  getTimerSessionStorageId,
} from '@/infrastructure/database/localOwner'

vi.mock('@/features/auth/api/auth.api', () => ({
  authService: {
    getProfile: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    guestLogin: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const setOnline = (online) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: online,
  })
}

const seedOwnerData = async () => {
  localStorage.setItem('ataraxia_local_profile', JSON.stringify({
    id: 'logout-user',
    name: 'Logout User',
  }))

  const ownerId = getLocalOwnerId()

  await db.tasks.put({
    id: 'task-1',
    ownerId,
    title: 'Keep me isolated',
    status: 'TODO',
    syncStatus: 'pending_create',
    updatedAt: Date.now(),
    deletedAt: null,
  })
  await db.tags.put({
    id: 'tag-1',
    ownerId,
    name: 'Local tag',
    color: '#ffffff',
    syncStatus: 'synced',
    updatedAt: Date.now(),
    deletedAt: null,
  })
  await db.settings.put({
    id: getSettingsStorageId('me', ownerId),
    ownerId,
    remoteId: 'me',
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    volume: 50,
    theme: 'dark',
    syncStatus: 'synced',
    updatedAt: Date.now(),
  })
  await db.syncQueue.put({
    id: 'mutation-1',
    ownerId,
    method: 'POST',
    url: '/tasks',
    entity: 'tasks',
    entityId: 'task-1',
    retries: 0,
    ts: Date.now(),
    status: 'pending',
  })
  await db.timerSessions.put({
    id: getTimerSessionStorageId(ownerId),
    ownerId,
    mode: 'FOCUS',
    timeLeft: 1200,
    initialTime: 1500,
    isActive: false,
    isPaused: true,
    currentRound: 2,
    lastUpdatedAt: Date.now(),
  })

  return ownerId
}

const runLogout = async (payload) => {
  const channel = stdChannel()
  const dispatched = []
  const task = runSaga(
    {
      channel,
      dispatch: (action) => dispatched.push(action),
    },
    authSaga
  )

  await Promise.resolve()
  channel.put(logoutRequest(payload))

  await vi.waitFor(() => {
    expect(dispatched.some((action) => action.type === logoutSuccess.type)).toBe(true)
  })

  task.cancel()
  await task.toPromise().catch(() => undefined)
}

describe('authSaga logout local data policy', () => {
  beforeEach(async () => {
    localStorage.clear()
    setOnline(false)
    await db.open()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
      db.timerSessions.clear(),
    ])
  })

  afterEach(async () => {
    localStorage.clear()
    await Promise.all([
      db.tasks.clear(),
      db.tags.clear(),
      db.settings.clear(),
      db.syncQueue.clear(),
      db.timerSessions.clear(),
    ])
    vi.restoreAllMocks()
  })

  it('preserves owner-scoped IndexedDB data when preserveLocalData is true', async () => {
    const ownerId = await seedOwnerData()

    await runLogout({ preserveLocalData: true })

    expect(await db.tasks.where('ownerId').equals(ownerId).count()).toBe(1)
    expect(await db.tags.where('ownerId').equals(ownerId).count()).toBe(1)
    expect(await db.settings.where('ownerId').equals(ownerId).count()).toBe(1)
    expect(await db.syncQueue.where('ownerId').equals(ownerId).count()).toBe(1)
    expect(await db.timerSessions.where('ownerId').equals(ownerId).count()).toBe(1)
    expect(localStorage.getItem('ataraxia_local_profile')).toBeNull()
  })

  it('deletes only the active owner local data when preserveLocalData is false', async () => {
    const ownerId = await seedOwnerData()

    await db.tasks.put({
      id: 'other-task',
      ownerId: 'user:other-account',
      title: 'Other account data',
      status: 'TODO',
      syncStatus: 'synced',
      updatedAt: Date.now(),
      deletedAt: null,
    })

    await runLogout({ preserveLocalData: false })

    expect(await db.tasks.where('ownerId').equals(ownerId).count()).toBe(0)
    expect(await db.tags.where('ownerId').equals(ownerId).count()).toBe(0)
    expect(await db.settings.where('ownerId').equals(ownerId).count()).toBe(0)
    expect(await db.syncQueue.where('ownerId').equals(ownerId).count()).toBe(0)
    expect(await db.timerSessions.where('ownerId').equals(ownerId).count()).toBe(0)
    expect(await db.tasks.where('ownerId').equals('user:other-account').count()).toBe(1)
    expect(localStorage.getItem('ataraxia_local_profile')).toBeNull()
  })
})
