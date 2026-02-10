import { apiClient } from './client';
import { syncManager } from './sync.manager';
import { CreateTimerDto, TimerResponse } from '../dto/timers.types';

const ENDPOINT = '/timers';

export const timersService = {
    getAll: async () => {
        const response = await apiClient.get<TimerResponse[]>(ENDPOINT);
        return response.data;
    },

    saveSession: async (data: CreateTimerDto, isSyncing = false) => {
        try {
            const response = await apiClient.post<TimerResponse>(ENDPOINT, data);
            return response.data;
        } catch (error: any) {
            if (isSyncing) throw error;

            if (!error.response || error.response.status >= 500) {
                const tempSession = {
                    ...data,
                    id: `temp_timer_${Date.now()}`,
                    tempId: `off_timer_${Date.now()}`,
                    createdAt: new Date().toISOString(),
                    isOffline: true
                };

                syncManager.addToQueue('outbox_timers', tempSession);

                console.warn("Sesión guardada localmente (Offline)");

                return tempSession as unknown as TimerResponse;
            }
            throw error;
        }
    }
};