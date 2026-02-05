import { apiClient } from './client';

export const achievementsService = {
    getAchievements: async () => {
        const response = await apiClient.get('/achievements');
        return response.data;
    },

    getStats: async () => {
        const response = await apiClient.get('/gamification/stats');
        return response.data;
    }
};