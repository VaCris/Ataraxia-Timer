import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const readStoredValue = <T,>(key: string, fallback: T): T => {
  const value = localStorage.getItem(`ataraxia_${key}`)

  if (value === null || value === undefined) {
    return fallback
  }

  return value as T
}

const readStoredNumber = (key: string, fallback: number): number => {
  const value = localStorage.getItem(`ataraxia_${key}`)

  if (value === null || value === undefined) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const readStoredBoolean = (key: string, fallback: boolean): boolean => {
  const value = localStorage.getItem(`ataraxia_${key}`)

  if (value === null || value === undefined) {
    return fallback
  }

  return value === 'true'
}

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
    const focusDuration = readStoredNumber(
      'focusDuration',
      apiSettings?.focusDuration ?? 25
    )

    const shortBreakDuration = readStoredNumber(
      'shortBreakDuration',
      apiSettings?.shortBreakDuration ?? 5
    )

    const longBreakDuration = readStoredNumber(
      'longBreakDuration',
      apiSettings?.longBreakDuration ?? 15
    )

    const longBreakInterval = readStoredNumber(
      'longBreakInterval',
      apiSettings?.longBreakInterval ?? 4
    )

    return {
      ...uiSettingsState,

      accentColor: readStoredValue(
        'accentColor',
        uiSettingsState.accentColor || '#14b8a6'
      ),

      bgImage: readStoredValue(
        'bgImage',
        uiSettingsState.bgImage || null
      ),

      blurIntensity: readStoredNumber(
        'blurIntensity',
        uiSettingsState.blurIntensity || 0
      ),

      volume: readStoredNumber(
        'volume',
        uiSettingsState.volume || 50
      ),

      is24Hour: readStoredBoolean(
        'is24Hour',
        uiSettingsState.is24Hour || false
      ),

      customShortcuts: safeParseShortcuts(),

      focusDuration,
      shortBreakDuration,
      longBreakDuration,
      autoStartBreaks: readStoredBoolean(
        'autoStartBreaks',
        apiSettings?.autoStartBreaks ?? false
      ),
      autoStartPomodoros: readStoredBoolean(
        'autoStartPomodoros',
        apiSettings?.autoStartPomodoros ?? false
      ),
      longBreakInterval,
      theme: readStoredValue('theme', apiSettings?.theme ?? 'dark'),
      soundEnabled: readStoredBoolean(
        'soundEnabled',
        apiSettings?.soundEnabled ?? true
      ),
      platform: readStoredValue('platform', apiSettings?.platform ?? 'web'),
    }
  }, [apiSettings, uiSettingsState])

  return uiSettings
}
