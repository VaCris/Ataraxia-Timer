import api from '@api/Client';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

export const tasksService = {
    getAll: async () => {
        const { data } = await api.get('/tasks');
        return data;
    },

    getById: async (id: string) => {
        const { data } = await api.get(`/tasks/${id}`);
        return data;
    },

    create: async (taskData: CreateTaskDto) => {
        const { data } = await api.post('/tasks', taskData);
        return data;
    },

    update: async (id: string, updateData: UpdateTaskDto) => {
        const { data } = await api.patch(`/tasks/${id}`, updateData);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/tasks/${id}`);
        return data;
    }
};