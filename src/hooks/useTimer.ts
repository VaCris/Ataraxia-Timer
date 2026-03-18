import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'

export const useTimer = () => {
  const state = useSelector((s: RootState) => s.timer)
  const dispatch = useDispatch()
  return { state, dispatch }
}