import api from '@api/client';
import { CreateTagDto, UpdateTagDto, TagResponse } from '../types/tag.dto';

export const tagsService = {
    getAll: async (): Promise<TagResponse[]> => {
        const { data } = await api.get<TagResponse[]>('/tags')
        return data
    },

    getById: async (id: string): Promise<TagResponse> => {
        const { data } = await api.get<TagResponse>(`/tags/${id}`)
        return data
    },

    create: async (tagData: CreateTagDto): Promise<TagResponse> => {
        const { data } = await api.post<TagResponse>('/tags', tagData)
        return data
    },

    update: async (id: string, updateData: UpdateTagDto): Promise<TagResponse> => {
        const { data } = await api.patch<TagResponse>(`/tags/${id}`, updateData)
        return data
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/tags/${id}`)
    }
};