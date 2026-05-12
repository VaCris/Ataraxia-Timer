import api from '@api/client';
import type {
    CreateTimerDto,
    TimerResponse,
    UpdateTimerDto,
} from '@/features/pomodoro/types/timer.dto';

const ENDPOINTS = {
    BASE: '/timers',
    BY_ID: (id: string) => `/timers/${id}`,
};

export const timersService = {
    create: async (payload: CreateTimerDto): Promise<TimerResponse> => {
        const { data } = await api.post<TimerResponse>(ENDPOINTS.BASE, payload);
        return data;
    },

    getAll: async (): Promise<TimerResponse[]> => {
        const { data } = await api.get<TimerResponse[]>(ENDPOINTS.BASE);
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

    delete: async (id: string): Promise<void> => {
        await api.delete(ENDPOINTS.BY_ID(id));
    },
};