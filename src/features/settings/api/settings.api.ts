import api from '@api/client';
import { CreateSettingDto, SettingResponse, UpdateSettingDto } from '../types/setting.dto';

export const settingsService = {
    get: async (): Promise<SettingResponse> => {
        const { data } = await api.get<SettingResponse>('/settings')
        return data
    },

    getAll: async (): Promise<SettingResponse[]> => {
        const { data } = await api.get<SettingResponse[]>('/settings/all')
        return data
    },

    create: async (data: CreateSettingDto): Promise<SettingResponse> => {
        const { data: res } = await api.post<SettingResponse>('/settings', data)
        return res
    },

    update: async (data: UpdateSettingDto): Promise<SettingResponse> => {
        const { data: res } = await api.patch<SettingResponse>('/settings', data)
        return res
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/settings/${id}`)
    },

    adminUpdate: async (id: string, data: UpdateSettingDto): Promise<SettingResponse> => {
        const { data: res } = await api.patch<SettingResponse>(`/settings/${id}`, data)
        return res
    }
};