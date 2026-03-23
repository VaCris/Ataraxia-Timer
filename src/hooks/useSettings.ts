import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSettingsRequest,
  updateSettingsRequest,
  fetchSettingsSuccess
} from '@store/slices/settingsSlice'
import type { RootState } from '@store/index'

export const useSettings = () => {
  const dispatch = useDispatch()
  const { item, status, error } = useSelector((s: RootState) => s.settings)

  const fetch = () => dispatch(fetchSettingsRequest())

  const update = (payload: any) =>
    dispatch(updateSettingsRequest(payload))

  const setLocal = (partial: any) => {
    const next = { ...item, ...partial }
    dispatch(fetchSettingsSuccess(next))

    localStorage.setItem('ataraxia_settings', JSON.stringify(next))
  }

  return {
    settings: item,
    loading: status === 'loading',
    error,
    fetch,
    update,
    setLocal
  }
}