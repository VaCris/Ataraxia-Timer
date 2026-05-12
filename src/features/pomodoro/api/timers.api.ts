import api from '@api/client';
import { CreateTimerDto, TimerResponse, UpdateTimerDto } from '@/features/pomodoro/types/timer.dto';
import { addToSyncQueue } from '@/infrastructure/sync/syncManager';

export const timersService = {
    create: async (data: CreateTimerDto): Promise<TimerResponse> => {
        try {
            const { data: res } = await api.post<TimerResponse>('/timers', data);
            return res;
        } catch (error: any) {
            const isNetworkError = error.message === 'Network Error' || error.code === 'ERR_NETWORK';
            
            if (isNetworkError) {
                addToSyncQueue({
                    method: 'POST',
                    url: '/timers',
                    data: data
                });
                throw new Error('OFFLINE_SAVED');
            }
            throw error;
        }
    },

    getAll: async (): Promise<TimerResponse[]> => {
        const { data } = await api.get<TimerResponse[]>('/timers')
        return data
    },

    getById: async (id: string): Promise<TimerResponse> => {
        const { data } = await api.get<TimerResponse>(`/timers/${id}`)
        return data
    },

    update: async (id: string, data: UpdateTimerDto): Promise<TimerResponse> => {
        if (!id) return Promise.reject('INVALID_ID');
    
        const { data: res } = await api.patch<TimerResponse>(`/timers/${id}`, data);
        return res;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/timers/${id}`)
    }
};