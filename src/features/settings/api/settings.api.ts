import api from '@api/client';
import type {
    CreateSettingDto,
    SettingResponse,
    UpdateSettingDto,
} from '../types/setting.dto';

const ENDPOINTS = {
    BASE: '/settings',
    ALL: '/settings/all',
    BY_ID: (id: string) => `/settings/${id}`,
};

export const settingsService = {
    get: async (): Promise<SettingResponse> => {
        const { data } = await api.get<SettingResponse>(ENDPOINTS.BASE);
        return data;
    },

    getAll: async (): Promise<SettingResponse[]> => {
        const { data } = await api.get<SettingResponse[]>(ENDPOINTS.ALL);
        return data;
    },

    create: async (payload: CreateSettingDto): Promise<SettingResponse> => {
        const { data } = await api.post<SettingResponse>(ENDPOINTS.BASE, payload);
        return data;
    },

    update: async (payload: UpdateSettingDto): Promise<SettingResponse> => {
        const { data } = await api.patch<SettingResponse>(ENDPOINTS.BASE, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(ENDPOINTS.BY_ID(id));
    },

    adminUpdate: async (
        id: string,
        payload: UpdateSettingDto
    ): Promise<SettingResponse> => {
        const { data } = await api.patch<SettingResponse>(
            ENDPOINTS.BY_ID(id),
            payload
        );

        return data;
    },
};