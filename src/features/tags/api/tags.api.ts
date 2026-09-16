import api from '@api/client';
import type {
    CreateTagDto,
    UpdateTagDto,
    TagResponse,
} from '../types/tag.dto';

const ENDPOINTS = {
    BASE: '/tags',
    BY_ID: (id: string) => `/tags/${id}`,
};

export const tagsService = {
    getAll: async (): Promise<TagResponse[]> => {
        const { data } = await api.get<TagResponse[]>(ENDPOINTS.BASE);
        return data;
    },

    getById: async (id: string): Promise<TagResponse> => {
        const { data } = await api.get<TagResponse>(ENDPOINTS.BY_ID(id));
        return data;
    },

    create: async (payload: CreateTagDto): Promise<TagResponse> => {
        const { data } = await api.post<TagResponse>(ENDPOINTS.BASE, payload);
        return data;
    },

    update: async (
        id: string,
        payload: UpdateTagDto
    ): Promise<TagResponse> => {
        const { data } = await api.put<TagResponse>(
            ENDPOINTS.BY_ID(id),
            payload
        );

        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(ENDPOINTS.BY_ID(id));
    },
};