import { apiClient } from './client';
import { CreateTimerDto, TimerResponse } from '../dto/timers.types';

export const timersService = {
    getAll: async () => {
        const response = await apiClient.get<TimerResponse[]>('/timers');
        return response.data;
    },

    saveSession: async (data: CreateTimerDto) => {
        const response = await apiClient.post<TimerResponse>('/timers', data);
        return response.data;
    }
};