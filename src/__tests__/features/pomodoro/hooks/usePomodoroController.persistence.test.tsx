import 'fake-indexeddb/auto'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { renderHook, waitFor } from '@testing-library/react'
import timerReducer from '@/features/pomodoro/store/timerSlice'
import { usePomodoroController } from '@/features/pomodoro/hooks/usePomodoroController'
import { db } from '@/infrastructure/database/db'
import { getLocalOwnerId, getTimerSessionStorageId } from '@/infrastructure/database/localOwner'

vi.mock('@/features/pomodoro/hooks/useTimer', () => ({
  useTimer: vi.fn(),
}))

vi.mock('@/features/gamification/api/gamification.api', () => ({
  gamificationService: {
    checkAchievements: vi.fn(),
  },
}))

const createStore = () => configureStore({
  reducer: {
    timer: timerReducer,
    settings: () => ({ api: null }),
  },
})

describe('usePomodoroController persisted session', () => {
  beforeEach(async () => {
    localStorage.clear()
    localStorage.setItem('ataraxia_local_profile', JSON.stringify({
      id: 'pomodoro-test-user',
      name: 'Pomodoro Test User',
    }))
    await db.open()
    await db.timerSessions.clear()
  })

  afterEach(async () => {
    localStorage.clear()
    await db.timerSessions.clear()
    vi.restoreAllMocks()
  })

  it('restores only the active profile persisted timer after the app is reopened', async () => {
    const ownerId = getLocalOwnerId()

    await db.timerSessions.put({
      id: getTimerSessionStorageId(ownerId),
      ownerId,
      mode: 'FOCUS',
      timeLeft: 735,
      initialTime: 1500,
      isActive: true,
      isPaused: false,
      currentRound: 3,
      lastUpdatedAt: Date.now(),
    })

    await db.timerSessions.put({
      id: 'current_session:user:another-user',
      ownerId: 'user:another-user',
      mode: 'LONG_BREAK',
      timeLeft: 60,
      initialTime: 900,
      isActive: false,
      isPaused: true,
      currentRound: 9,
      lastUpdatedAt: Date.now() + 1,
    })

    const store = createStore()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { result } = renderHook(() => usePomodoroController(), { wrapper })

    await waitFor(() => {
      expect(result.current.currentRound).toBe(3)
      expect(store.getState().timer.timeLeft).toBe(735)
    })

    const restored = store.getState().timer
    expect(restored.mode).toBe('FOCUS')
    expect(restored.initialTime).toBe(1500)
    expect(restored.isActive).toBe(false)
    expect(restored.isPaused).toBe(true)
  })
})
