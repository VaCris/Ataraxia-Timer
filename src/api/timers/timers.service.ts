import api from '@api/client';
import { CreateTimerDto, TimerResponse, UpdateTimerDto } from './dto/timer.dto';

export const timersService = {
    create: async (data: CreateTimerDto): Promise<TimerResponse> => {
        const { data: res } = await api.post<TimerResponse>('/timers', data)
        return res
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
        const { data: res } = await api.patch<TimerResponse>(`/timers/${id}`, data)
        return res
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/timers/${id}`)
    }
};