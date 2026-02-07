import { apiClient } from './client';
import { CreateTagDto, UpdateTagDto, TagResponse } from '../dto/tags.types';

const ENDPOINT = '/tags';

export const tagsService = {
    getAll: async () => {
        const response = await apiClient.get<TagResponse[]>(ENDPOINT);
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await apiClient.get<TagResponse>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    create: async (data: CreateTagDto) => {
        const response = await apiClient.post<TagResponse>(ENDPOINT, data);
        return response.data;
    },

    update: async (id: string, data: UpdateTagDto) => {
        const response = await apiClient.patch<TagResponse>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    }
};