import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import { tick, toggleTimer } from '@store/slices/timerSlice'

export const useTimer = (onComplete?: () => void) => {
  const state = useSelector((s: RootState) => s.timer)
  const dispatch = useDispatch()

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    if (state.isActive && state.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(tick())
      }, 1000)
    } else if (state.timeLeft === 0 && state.isActive) {
      dispatch(toggleTimer())

      if (onComplete) {
        onComplete()
      }
    }

    return () => {
      if (interval !== null) clearInterval(interval)
    }
  }, [state.isActive, state.timeLeft, dispatch, onComplete])

  return { state, dispatch }
}