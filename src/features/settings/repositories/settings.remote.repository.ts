import { settingsService } from '../api/settings.api'
import { mapModelToUpdateDto } from '../mappers/mapSetting'
import type { SettingModel } from '../types/setting.model'

export const settingsRemoteRepository = {
    async update(setting: SettingModel) {
        const dto = mapModelToUpdateDto(setting)
        return settingsService.update(dto)
    },
}