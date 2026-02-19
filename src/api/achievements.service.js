import { apiClient } from './client';

export const achievementsService = {
    getAchievements: async () => {
        const response = await apiClient.get('/gamification/achievements');
        return response.data;
    },

    getStats: async () => {
        const response = await apiClient.get('/gamification/stats');
        return response.data;
    }
};