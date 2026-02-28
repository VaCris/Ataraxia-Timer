import { apiClient } from './client';
import { CreateSettingDto, SettingResponse } from '../dto/settings.types';
import { syncManager } from './sync.manager';

const SETTINGS_ENDPOINT = '/settings';

const cleanSettingsPayload = (data: any) => {
    const {
        id,
        _id,
        userId,
        createdAt,
        updatedAt,
        __v,
        ...cleanData
    } = data;
    return cleanData;
};

export const settingsService = {
    getSettings: async () => {
        try {
            const response = await apiClient.get<SettingResponse>(SETTINGS_ENDPOINT);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) return null;
            throw error;
        }
    },

    createSettings: async (data: CreateSettingDto) => {
        const payload = cleanSettingsPayload(data);
        const response = await apiClient.post<SettingResponse>(SETTINGS_ENDPOINT, payload);
        return response.data;
    },

    updateSettings: async (data: any, isSyncing = false) => {
        try {
            const payload = cleanSettingsPayload(data);
            const response = await apiClient.patch(SETTINGS_ENDPOINT, payload);
            return response.data;
        } catch (error: any) {
            if (isSyncing) throw error;

            if (!error.response) {
                syncManager.addToQueue('outbox_settings', data);
                return data;
            }
            throw error;
        }
    },

    saveSettings: async (data: CreateSettingDto) => {
        const existing = await settingsService.getSettings();
        const payload = cleanSettingsPayload(data);

        if (existing) {
            return settingsService.updateSettings(payload);
        }

        return settingsService.createSettings(payload as CreateSettingDto);
    }
};