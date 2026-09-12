import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'

const DEFAULT_BACKGROUND = '/assets/default-image.png'

const readStoredValue = <T,>(key: string, fallback: T): T => {
  const value = localStorage.getItem(`ataraxia_${key}`)

  if (value === null || value === undefined) {
    return fallback
  }

  return value as T
}

const readStoredBackground = (fallback: string | null): { value: string; isDefault: boolean } => {
  const storedValue = localStorage.getItem('ataraxia_bgImage')

  if (!storedValue) {
    return { value: fallback || DEFAULT_BACKGROUND, isDefault: true }
  }

  return { value: storedValue, isDefault: false }
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
    const pomodoroLength = readStoredNumber(
      'pomodoroLength',
      apiSettings?.pomodoroLength ?? (apiSettings as any)?.focusDuration ?? 25
    )

    const shortBreakLength = readStoredNumber(
      'shortBreakLength',
      apiSettings?.shortBreakLength ?? (apiSettings as any)?.shortBreakDuration ?? 5
    )

    const longBreakLength = readStoredNumber(
      'longBreakLength',
      apiSettings?.longBreakLength ?? (apiSettings as any)?.longBreakDuration ?? 15
    )

    const longBreakInterval = readStoredNumber(
      'longBreakInterval',
      apiSettings?.longBreakInterval ?? 4
    )

    const background = readStoredBackground(uiSettingsState.bgImage || DEFAULT_BACKGROUND)

    return {
      ...uiSettingsState,

      accentColor: readStoredValue(
        'accentColor',
        uiSettingsState.accentColor || '#14b8a6'
      ),

      bgImage: background.value,
      isDefaultBackground: background.isDefault,

      blurIntensity: readStoredNumber(
        'blurIntensity',
        uiSettingsState.blurIntensity || 0
      ),

      is24Hour: readStoredBoolean(
        'is24Hour',
        uiSettingsState.is24Hour || false
      ),

      customShortcuts: safeParseShortcuts(),

      pomodoroLength,
      shortBreakLength,
      longBreakLength,
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
      volume: readStoredNumber('volume', apiSettings?.volume ?? 50),
    }
  }, [apiSettings, uiSettingsState])

  return uiSettings
}
