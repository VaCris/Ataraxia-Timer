import { apiClient } from './client';
import { CreateTagDto, UpdateTagDto, TagResponse } from '../dto/tags.types';

export const tagsService = {
    getAll: async () => {
        const response = await apiClient.get<TagResponse[]>('/tags');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<TagResponse>(`/tags/${id}`);
        return response.data;
    },

    create: async (data: CreateTagDto) => {
        const response = await apiClient.post<TagResponse>('/tags', data);
        return response.data;
    },

    update: async (id: string, data: UpdateTagDto) => {
        const response = await apiClient.patch<TagResponse>(`/tags/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/tags/${id}`);
    }
};