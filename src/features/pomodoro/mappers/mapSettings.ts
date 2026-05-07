import { SettingDto } from '@/features/settings/types/setting.dto'
import { PomodoroSettings } from '../models/PomodoroSettings'

export const mapSettings = (dto: SettingDto | null | undefined): PomodoroSettings => {
    return {
        focusDuration: dto?.focusDuration ?? 25,
        shortBreakDuration: dto?.shortBreakDuration ?? 5,
        longBreakDuration: dto?.longBreakDuration ?? 15,
        autoStartBreaks: dto?.autoStartBreaks ?? false,
        autoStartPomodoros: dto?.autoStartPomodoros ?? false,
        longBreakInterval: dto?.longBreakInterval ?? 4
    }
}