import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { tick, pauseTimer } from '@/features/pomodoro/store/timerSlice'

export const useTimer = (onComplete?: () => void) => {
  const timer = useSelector((state: RootState) => state.timer)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!timer.isActive) return

    if (timer.timeLeft <= 0) {
      dispatch(pauseTimer())

      if (onComplete) {
        onComplete()
      }

      return
    }

    const interval = window.setInterval(() => {
      dispatch(tick())
    }, 1000)

    return () => {
      window.clearInterval(interval)
    }
  }, [timer.isActive, timer.timeLeft, dispatch, onComplete])

  return timer
}