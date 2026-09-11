import 'fake-indexeddb/auto'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { renderHook, waitFor } from '@testing-library/react'
import timerReducer from '@/features/pomodoro/store/timerSlice'
import { usePomodoroController } from '@/features/pomodoro/hooks/usePomodoroController'
import { db } from '@/infrastructure/database/db'

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
    await db.open()
    await db.timerSessions.clear()
  })

  afterEach(async () => {
    localStorage.clear()
    await db.timerSessions.clear()
    vi.restoreAllMocks()
  })

  it('restores a persisted timer after the app is reopened', async () => {
    await db.timerSessions.put({
      id: 'current_session',
      mode: 'FOCUS',
      timeLeft: 735,
      initialTime: 1500,
      isActive: true,
      isPaused: false,
      currentRound: 3,
      lastUpdatedAt: Date.now(),
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
