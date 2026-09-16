import api from '@api/client';
import type {
    SettingRequestDto,
    SettingResponseDto,
} from '../types/setting.dto';

const ENDPOINTS = {
    ME: '/settings/me',
};

export const settingsService = {
    get: async (): Promise<SettingResponseDto> => {
        const { data } = await api.get<SettingResponseDto>(ENDPOINTS.ME);
        return data;
    },

    update: async (payload: SettingRequestDto): Promise<SettingResponseDto> => {
        const { data } = await api.patch<SettingResponseDto>(ENDPOINTS.ME, payload);
        return data;
    },
};
