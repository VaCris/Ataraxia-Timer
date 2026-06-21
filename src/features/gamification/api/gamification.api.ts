import api from '@api/client';
import { CreateAchievementDto, UpdateAchievementDto, GetLeaderboardDto } from './dto/gamification.dto';

export const gamificationService = {
    getLeaderboard: async (params?: GetLeaderboardDto) => {
        const { data } = await api.get('/gamification/leaderboard', { params })
        return data
    },

    getStats: async () => {
        const { data } = await api.get('/gamification/stats')
        return data
    },

    getAchievements: async () => {
        const { data } = await api.get('/gamification/achievements')
        return data
    },

    testActivity: async () => {
        const { data } = await api.post('/gamification/test-activity')
        return data
    },

    checkAchievements: async () => {
        const { data } = await api.post('/gamification/check-achievements')
        return data
    },

    // Admin endpoints
    createAchievement: async (data: CreateAchievementDto) => {
        const res = await api.post('/gamification/achievements', data)
        return res.data
    },

    updateAchievement: async (code: string, data: UpdateAchievementDto) => {
        const res = await api.patch(`/gamification/achievements/${code}`, data)
        return res.data
    },

    uploadAchievementIcon: async (code: string, file: FormData) => {
        const res = await api.post(`/gamification/achievements/${code}/icon`, file)
        return res.data
    }
};