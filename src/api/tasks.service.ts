import { apiClient } from './client';
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '../dto/tasks.types';

export const tasksService = {
    getAll: async () => {
        const response = await apiClient.get<TaskResponse[]>('/tasks');
        return response.data;
    },

    create: async (data: CreateTaskDto) => {
        const response = await apiClient.post<TaskResponse>('/tasks', data);
        return response.data;
    },

    update: async (id: string, data: UpdateTaskDto) => {
        const response = await apiClient.patch<TaskResponse>(`/tasks/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/tasks/${id}`);
    }
};