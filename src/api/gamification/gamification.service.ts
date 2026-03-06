import api from '@api/client';
import { GetLeaderboardDto } from '@api/shared/dto/app.dto';

export const gamificationService = {
    getLeaderboard: async (params?: GetLeaderboardDto) => {
        const { data } = await api.get('/gamification/leaderboard', { params });
        return data;
    },

    getAchievements: async () => {
        const { data } = await api.get('/gamification/achievements');
        return data;
    },

    getProgress: async () => {
        const { data } = await api.get('/gamification/progress');
        return data;
    }
};