import { apiClient } from './client';
import { syncManager } from './sync.manager';
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '../dto/tasks.types';

const ENDPOINT = '/tasks';

export const tasksService = {
    getAll: async () => {
        let tasks: TaskResponse[] = [];

        try {
            const response = await apiClient.get<TaskResponse[]>(ENDPOINT);
            tasks = response.data || [];
        } catch (error) {
            console.warn("Could not load the server, checking local cache...");
        }

        const outbox = JSON.parse(localStorage.getItem('outbox_tasks') || '[]');
        const pendingTasks = outbox.map((t: any) => ({
            id: t.tempId,
            userId: 'offline',
            title: t.title,
            tag: t.tag || 'General',
            completed: t.completed || false,
            createdAt: t.createdAt || new Date().toISOString()
        }));
        const uniquePending = pendingTasks.filter((p: any) => !tasks.find(t => t.id === p.id));

        return [...tasks, ...uniquePending];
    },

    create: async (data: CreateTaskDto, isSyncing = false) => {
        try {
            const response = await apiClient.post<TaskResponse>(ENDPOINT, data);
            return response.data;
        } catch (error: any) {
            if (isSyncing) throw error;
            if (!error.response || error.response.status >= 500) {
                console.warn("Offline: Saving homework locally");

                const tempTask = {
                    ...data,
                    id: `temp_${Date.now()}`,
                    tempId: `temp_${Date.now()}`,
                    userId: 'offline',
                    completed: false,
                    createdAt: new Date().toISOString()
                };

                syncManager.addToQueue('outbox_tasks', tempTask);
                return tempTask as unknown as TaskResponse;
            }
            throw error;
        }
    },

    update: async (id: string, data: UpdateTaskDto) => {
        if (id.toString().startsWith('temp_')) {
            const outbox = JSON.parse(localStorage.getItem('outbox_tasks') || '[]');
            const updatedOutbox = outbox.map((t: any) => t.tempId === id ? { ...t, ...data } : t);
            localStorage.setItem('outbox_tasks', JSON.stringify(updatedOutbox));
            return { id, ...data } as any;
        }

        const response = await apiClient.patch<TaskResponse>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        if (id.toString().startsWith('temp_')) {
            const outbox = JSON.parse(localStorage.getItem('outbox_tasks') || '[]');
            const filtered = outbox.filter((t: any) => t.tempId !== id);
            localStorage.setItem('outbox_tasks', JSON.stringify(filtered));
            return;
        }

        await apiClient.delete(`${ENDPOINT}/${id}`);
    }
};