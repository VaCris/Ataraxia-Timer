import { apiClient } from './client';
import { syncManager } from './sync.manager';
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '../dto/tasks.types';

const ENDPOINT = '/tasks';

export const tasksService = {
    getAll: async () => {
        const response = await apiClient.get<TaskResponse[]>(ENDPOINT);
        return response.data;
    },

    create: async (data: CreateTaskDto, isSyncing = false) => {
        try {
            const response = await apiClient.post<TaskResponse>(ENDPOINT, data);
            return response.data;
        } catch (error: any) {
            if (isSyncing) throw error;

            if (!error.response || error.response.status >= 500) {
                const tempTask = { ...data, tempId: `off_${Date.now()}`, id: `temp_${Date.now()}`, isOffline: true };
                syncManager.addToQueue('outbox_tasks', tempTask);
                return tempTask as any;
            }
            throw error;
        }
    },

    update: async (id: string, data: UpdateTaskDto) => {
        const response = await apiClient.patch<TaskResponse>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`${ENDPOINT}/${id}`);
    }
};