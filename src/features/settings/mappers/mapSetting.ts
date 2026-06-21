import { SettingModel } from "../types/setting.model"
import { SettingResponse } from "../types/setting.dto"

const DEFAULTS = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    theme: "light",
    soundEnabled: true,
    platform: "web"
}

export function mapSettingDtoToModel(dto: SettingResponse): SettingModel {
    return {
        id: dto.id,
        userId: dto.userId,

        focusDuration: dto.focusDuration ?? DEFAULTS.focusDuration,
        shortBreakDuration: dto.shortBreakDuration ?? DEFAULTS.shortBreakDuration,
        longBreakDuration: dto.longBreakDuration ?? DEFAULTS.longBreakDuration,
        longBreakInterval: dto.longBreakInterval ?? DEFAULTS.longBreakInterval,

        autoStartBreaks: dto.autoStartBreaks ?? DEFAULTS.autoStartBreaks,
        autoStartPomodoros: dto.autoStartPomodoros ?? DEFAULTS.autoStartPomodoros,

        theme: dto.theme ?? DEFAULTS.theme,
        soundEnabled: dto.soundEnabled ?? DEFAULTS.soundEnabled,
        platform: dto.platform ?? DEFAULTS.platform,

        syncStatus: 'synced',
        updatedAt: Date.now()
    }
}

export function mapModelToUpdateDto(model: SettingModel) {
    return {
        focusDuration: model.focusDuration,
        shortBreakDuration: model.shortBreakDuration,
        longBreakDuration: model.longBreakDuration,
        longBreakInterval: model.longBreakInterval,
        autoStartBreaks: model.autoStartBreaks,
        autoStartPomodoros: model.autoStartPomodoros,
        theme: model.theme,
        soundEnabled: model.soundEnabled,
        platform: model.platform
    }
}