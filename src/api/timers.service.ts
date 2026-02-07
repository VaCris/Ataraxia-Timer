import { apiClient } from './client';
import { CreateTimerDto, TimerResponse } from '../dto/timers.types';

const ENDPOINT = '/timers';

export const timersService = {
    getAll: async () => {
        const response = await apiClient.get<TimerResponse[]>(ENDPOINT);
        return response.data;
    },

    saveSession: async (data: CreateTimerDto) => {
        const response = await apiClient.post<TimerResponse>(ENDPOINT, data);
        return response.data;
    }
};