import { apiClient } from './client';

const cleanTaskData = (data: any) => {
    const { id, _id, createdAt, updatedAt, userId, __v, isOptimistic, isSyncing, ...rest } = data;
    return rest;
};

export const tasksService = {
    getAll: async () => {
        const res = await apiClient.get('/tasks');
        return res.data;
    },
    create: async (data: any) => {
        const res = await apiClient.post('/tasks', data);
        return res.data;
    },
    update: async (id: string, updates: any) => {
        const res = await apiClient.patch(`/tasks/${id}`, cleanTaskData(updates));
        return res.data;
    },
    delete: async (id: string) => {
        await apiClient.delete(`/tasks/${id}`);
    }
};