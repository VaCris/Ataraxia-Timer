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
        try {
            const response = await apiClient.post<TagResponse>(ENDPOINT, data);
            return response.data;
        } catch (error: any) {
            if (!error.response) {
                const optimisticTag = {
                    ...data,
                    id: `temp_tag_${Date.now()}`,
                    userId: 'pending',
                    isOffline: true
                };

                return optimisticTag as unknown as TagResponse;
            }
            throw error;
        }
    },

    update: async (id: string, data: UpdateTagDto) => {
        const response = await apiClient.patch<TagResponse>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    }
};