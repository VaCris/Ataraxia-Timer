import { SettingModel } from "../types/setting.model"
import { SettingResponseDto } from "../types/setting.dto"
import { SETTINGS_DEFAULTS } from "../constants/settings.constants"

export function mapSettingDtoToModel(dto: SettingResponseDto): SettingModel {
    return {
        id: dto.id,

        pomodoroLength: dto.pomodoroLength ?? SETTINGS_DEFAULTS.pomodoroLength,
        shortBreakLength: dto.shortBreakLength ?? SETTINGS_DEFAULTS.shortBreakLength,
        longBreakLength: dto.longBreakLength ?? SETTINGS_DEFAULTS.longBreakLength,
        longBreakInterval: dto.longBreakInterval ?? SETTINGS_DEFAULTS.longBreakInterval,

        autoStartBreaks: dto.autoStartBreaks ?? SETTINGS_DEFAULTS.autoStartBreaks,
        autoStartPomodoros: dto.autoStartPomodoros ?? SETTINGS_DEFAULTS.autoStartPomodoros,

        soundEnabled: dto.soundEnabled ?? SETTINGS_DEFAULTS.soundEnabled,
        volume: dto.volume ?? SETTINGS_DEFAULTS.volume,
        theme: dto.theme ?? SETTINGS_DEFAULTS.theme,
        language: dto.language ?? SETTINGS_DEFAULTS.language,
        timeFormat: dto.timeFormat ?? SETTINGS_DEFAULTS.timeFormat,
        weekStart: dto.weekStart ?? SETTINGS_DEFAULTS.weekStart,
        notificationsEnabled: dto.notificationsEnabled ?? SETTINGS_DEFAULTS.notificationsEnabled,

        syncStatus: 'synced',
        updatedAt: Date.now()
    }
}

export function mapModelToUpdateDto(model: SettingModel) {
    return {
        pomodoroLength: model.pomodoroLength,
        shortBreakLength: model.shortBreakLength,
        longBreakLength: model.longBreakLength,
        longBreakInterval: model.longBreakInterval,
        autoStartBreaks: model.autoStartBreaks,
        autoStartPomodoros: model.autoStartPomodoros,
        soundEnabled: model.soundEnabled,
        volume: model.volume,
        theme: model.theme,
        language: model.language,
        timeFormat: model.timeFormat,
        weekStart: model.weekStart,
        notificationsEnabled: model.notificationsEnabled,
    }
}
