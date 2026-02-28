import { apiClient } from './client';

export const achievementsService = {
    getLeaderboard: async () => {
        const res = await apiClient.get('/gamification/leaderboard');
        return res.data;
    },
    getStats: async () => {
        const res = await apiClient.get('/gamification/stats');
        return res.data;
    },
    getUnlockedAchievements: async () => {
        const res = await apiClient.get('/gamification/achievements');
        return res.data;
    },
    registerActivity: async (data) => {
        const res = await apiClient.post('/gamification/test-activity', data);
        return res.data;
    },
    checkAchievements: async () => {
        const res = await apiClient.post('/gamification/check-achievements');
        return res.data;
    }
};