import { apiClient } from './client';
import { CreateSettingDto, UpdateSettingDto, SettingResponse } from '../dto/settings.types';
import { syncManager } from './sync.manager';

const SETTINGS_ENDPOINT = '/settings';

const sanitizeSettings = (data: CreateSettingDto): Partial<CreateSettingDto> => {
    const clean: Partial<CreateSettingDto> = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
            clean[key as keyof CreateSettingDto] = value;
        }
    });

    return clean;
};

export const settingsService = {
    getSettings: async () => {
        try {
            const response = await apiClient.get<SettingResponse>(SETTINGS_ENDPOINT);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    createSettings: async (data: CreateSettingDto) => {
        const response = await apiClient.post<SettingResponse>(SETTINGS_ENDPOINT, data);
        return response.data;
    },

    updateSettings: async (data: any, isSyncing = false) => {
        try {
            const response = await apiClient.patch('/settings', data);
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
        const payload = sanitizeSettings(data);

        if (existing) {
            return settingsService.updateSettings(payload);
        }

        return settingsService.createSettings(payload as CreateSettingDto);
    }
};