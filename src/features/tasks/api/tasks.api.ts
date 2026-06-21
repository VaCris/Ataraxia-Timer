import api from '@api/client';
import type {
    CreateTaskDto,
    UpdateTaskDto,
    TaskResponse,
} from '@/features/tasks/types/task.dto';

const ENDPOINTS = {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
};

export const tasksService = {
    getAll: async (): Promise<TaskResponse[]> => {
        const { data } = await api.get<TaskResponse[]>(ENDPOINTS.BASE);
        return data;
    },

    getById: async (id: string): Promise<TaskResponse> => {
        const { data } = await api.get<TaskResponse>(ENDPOINTS.BY_ID(id));
        return data;
    },

    create: async (payload: CreateTaskDto): Promise<TaskResponse> => {
        const { data } = await api.post<TaskResponse>(ENDPOINTS.BASE, payload);
        return data;
    },

    update: async (
        id: string,
        payload: UpdateTaskDto
    ): Promise<TaskResponse> => {
        const { data } = await api.patch<TaskResponse>(
            ENDPOINTS.BY_ID(id),
            payload
        );

        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(ENDPOINTS.BY_ID(id));
    },
};