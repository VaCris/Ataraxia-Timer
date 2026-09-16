import { SettingResponseDto } from '@/features/settings/types/setting.dto'
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

export const mapSettings = (dto: SettingResponseDto | null | undefined): PomodoroSettings => {
    return {
        pomodoroLength: readStoredNumber('pomodoroLength', (dto as any)?.pomodoroLength ?? (dto as any)?.focusDuration ?? 25),
        shortBreakLength: readStoredNumber('shortBreakLength', (dto as any)?.shortBreakLength ?? (dto as any)?.shortBreakDuration ?? 5),
        longBreakLength: readStoredNumber('longBreakLength', (dto as any)?.longBreakLength ?? (dto as any)?.longBreakDuration ?? 15),
        autoStartBreaks: readStoredBoolean('autoStartBreaks', dto?.autoStartBreaks ?? false),
        autoStartPomodoros: readStoredBoolean('autoStartPomodoros', dto?.autoStartPomodoros ?? false),
        longBreakInterval: readStoredNumber('longBreakInterval', dto?.longBreakInterval ?? 4)
    }
}
