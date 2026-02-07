import { apiClient } from './client';
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '../dto/tasks.types';

const ENDPOINT = '/tasks';

export const tasksService = {
    getAll: async () => {
        const response = await apiClient.get<TaskResponse[]>(ENDPOINT);
        return response.data;
    },

    create: async (data: CreateTaskDto) => {
        const response = await apiClient.post<TaskResponse>(ENDPOINT, data);
        return response.data;
    },

    update: async (id: string, data: UpdateTaskDto) => {
        const response = await apiClient.patch<TaskResponse>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    }
};