import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useUISettings = () => {
    const settingsItem = useSelector((state: any) => state.settings.item) || {}

    const uiSettings = useMemo(() => {
        return {
            accentColor: localStorage.getItem('ataraxia_accentColor') || '#e11d48',
            bgImage: localStorage.getItem('ataraxia_bgImage') || '',
            blurIntensity: Number(localStorage.getItem('ataraxia_blurIntensity')) || 0,
            is24Hour: localStorage.getItem('ataraxia_is24Hour') === 'true',
            customShortcuts: JSON.parse(localStorage.getItem('ataraxia_customShortcuts') || '[]'),

            focusDuration: settingsItem.focusDuration ?? 25,
            shortBreakDuration: settingsItem.shortBreakDuration ?? 5,
            longBreakDuration: settingsItem.longBreakDuration ?? 15,
            autoStartBreaks: settingsItem.autoStartBreaks ?? false,
            autoStartPomodoros: settingsItem.autoStartPomodoros ?? false,
            longBreakInterval: settingsItem.longBreakInterval ?? 4
        }
    }, [settingsItem])

    return uiSettings
}