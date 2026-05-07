import { settingsApi } from "../api/settings.api"
import { mapModelToUpdateDto } from "../mappers/mapSetting"
import { SettingModel } from "../types/setting.model"

export const settingsRemoteRepository = {
    async update(setting: SettingModel) {
        const dto = mapModelToUpdateDto(setting)
        return settingsApi.update(dto)
    }
}