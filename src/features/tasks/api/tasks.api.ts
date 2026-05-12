import api from '@api/client';
import {
    CreateTaskDto,
    UpdateTaskDto,
    TaskResponse,
} from '@/features/tasks/types/task.dto';

export const tasksService = {
    getAll: async (): Promise<TaskResponse[]> => {
        const { data } = await api.get<TaskResponse[]>('/tasks');
        return data;
    },

    getById: async (id: string): Promise<TaskResponse> => {
        const { data } = await api.get<TaskResponse>(`/tasks/${id}`);
        return data;
    },

    create: async (taskData: CreateTaskDto): Promise<TaskResponse> => {
        const { data } = await api.post<TaskResponse>('/tasks', taskData);
        return data;
    },

    update: async (
        id: string,
        updateData: UpdateTaskDto
    ): Promise<TaskResponse> => {
        const { data } = await api.patch<TaskResponse>(
            `/tasks/${id}`,
            updateData
        );
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },
};