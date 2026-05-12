import { SettingDto } from '@/features/settings/types/setting.dto'
import { PomodoroSettings } from '../models/PomodoroSettings'

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

export const mapSettings = (dto: SettingDto | null | undefined): PomodoroSettings => {
    return {
        focusDuration: readStoredNumber('focusDuration', dto?.focusDuration ?? 25),
        shortBreakDuration: readStoredNumber('shortBreakDuration', dto?.shortBreakDuration ?? 5),
        longBreakDuration: readStoredNumber('longBreakDuration', dto?.longBreakDuration ?? 15),
        autoStartBreaks: readStoredBoolean('autoStartBreaks', dto?.autoStartBreaks ?? false),
        autoStartPomodoros: readStoredBoolean('autoStartPomodoros', dto?.autoStartPomodoros ?? false),
        longBreakInterval: readStoredNumber('longBreakInterval', dto?.longBreakInterval ?? 4)
    }
}
