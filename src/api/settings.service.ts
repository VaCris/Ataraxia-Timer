import { apiClient } from './client';
import { CreateSettingDto, UpdateSettingDto, SettingResponse } from '../dto/settings.types';

const sanitizeSettings = (data: CreateSettingDto) => {
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
            const response = await apiClient.get<SettingResponse>('/settings');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    createSettings: async (data: CreateSettingDto) => {
        const response = await apiClient.post<SettingResponse>(
            '/settings',
            data
        );
        return response.data;
    },

    updateSettings: async (id: string, data: UpdateSettingDto) => {
        const response = await apiClient.patch<SettingResponse>(
            `/settings/${id}`,
            data
        );
        return response.data;
    },

    saveSettings: async (data: CreateSettingDto) => {
        const existing = await settingsService.getSettings();
        const payload = sanitizeSettings(data);

        if (existing) {
            return settingsService.updateSettings(existing.id, payload);
        }

        return settingsService.createSettings(payload);
    }
};
