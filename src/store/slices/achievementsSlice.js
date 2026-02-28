import { createSlice } from '@reduxjs/toolkit';

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState: {
        items: [],
        leaderboard: [],
        stats: { streak: 0, level: 1, xp: 0, nextLevelXp: 100 },
        loading: false,
        initialized: false,
        error: null
    },
    reducers: {
        fetchStatsRequest: (state) => { state.loading = true; },
        fetchStatsSuccess: (state, action) => {
            state.loading = false;
            state.stats = action.payload;
            state.initialized = true;
        },
        fetchStatsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.initialized = true;
        },
        fetchLeaderboardRequest: (state) => { state.loading = true; },
        fetchLeaderboardSuccess: (state, action) => {
            state.loading = false;
            state.leaderboard = action.payload;
        },
        fetchAchievementsRequest: (state) => { state.loading = true; },
        fetchAchievementsSuccess: (state, action) => {
            state.loading = false;
            state.items = action.payload;
        }
    }
});

export const {
    fetchStatsRequest, fetchStatsSuccess, fetchStatsFailure,
    fetchLeaderboardRequest, fetchLeaderboardSuccess,
    fetchAchievementsRequest, fetchAchievementsSuccess
} = achievementsSlice.actions;

export default achievementsSlice.reducer;