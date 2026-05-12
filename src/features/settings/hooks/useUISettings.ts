import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const safeParseShortcuts = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem('ataraxia_customShortcuts') || '{}')
  } catch {
    return {}
  }
}

export const useUISettings = () => {
  const apiSettings = useSelector((state: RootState) => state.settings.api)
  const uiSettingsState = useSelector((state: RootState) => state.settings.ui)

  const uiSettings = useMemo(() => {
    return {
      ...uiSettingsState,

      accentColor:
        localStorage.getItem('ataraxia_accentColor') ||
        uiSettingsState.accentColor ||
        '#e11d48',

      bgImage:
        localStorage.getItem('ataraxia_bgImage') ||
        uiSettingsState.bgImage ||
        null,

      blurIntensity:
        Number(localStorage.getItem('ataraxia_blurIntensity')) ||
        uiSettingsState.blurIntensity ||
        0,

      is24Hour:
        localStorage.getItem('ataraxia_is24Hour') === 'true' ||
        uiSettingsState.is24Hour ||
        false,

      customShortcuts: safeParseShortcuts(),

      focusDuration: apiSettings?.focusDuration ?? 25,
      shortBreakDuration: apiSettings?.shortBreakDuration ?? 5,
      longBreakDuration: apiSettings?.longBreakDuration ?? 15,
      autoStartBreaks: apiSettings?.autoStartBreaks ?? false,
      autoStartPomodoros: apiSettings?.autoStartPomodoros ?? false,
      longBreakInterval: apiSettings?.longBreakInterval ?? 4,
    }
  }, [apiSettings, uiSettingsState])

  return uiSettings
}