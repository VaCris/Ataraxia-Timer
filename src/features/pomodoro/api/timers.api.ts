import api from '@api/client';
import type {
    CreateTimerDto,
    TimerResponse,
    UpdateTimerDto,
} from '@/features/pomodoro/types/timer.dto';

const ENDPOINTS = {
    BASE: '/timers',
    HISTORY: '/timers/history',
    BY_ID: (id: string) => `/timers/${id}`,
    COMPLETE: (id: string) => `/timers/${id}/complete`,
};

export const timersService = {
    create: async (payload: CreateTimerDto): Promise<TimerResponse> => {
        const { data } = await api.post<TimerResponse>(ENDPOINTS.BASE, payload);
        return data;
    },

    getHistory: async (): Promise<TimerResponse[]> => {
        const { data } = await api.get<TimerResponse[]>(ENDPOINTS.HISTORY);
        return data;
    },

    getById: async (id: string): Promise<TimerResponse> => {
        const { data } = await api.get<TimerResponse>(ENDPOINTS.BY_ID(id));
        return data;
    },

    update: async (
        id: string,
        payload: UpdateTimerDto
    ): Promise<TimerResponse> => {
        const { data } = await api.patch<TimerResponse>(
            ENDPOINTS.BY_ID(id),
            payload
        );

        return data;
    },
    
    complete: async (id: string): Promise<any> => {
        const { data } = await api.patch<any>(ENDPOINTS.COMPLETE(id));
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(ENDPOINTS.BY_ID(id));
    },
};