import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {
        timerSettings: { work: 25, short: 5, long: 15 },
        autoStart: false,
        longBreakInterval: 4,
        accentColor: '#8b5cf6',
        bgImage: '',
        is24Hour: false,
        volume: 0.5
    },
    loading: false,
    initialized: false,
    error: null
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        fetchSettingsRequest: (state) => {
            state.loading = true;
        },
        fetchSettingsSuccess: (state, action) => {
            state.loading = false;
            state.data = { ...state.data, ...action.payload };
            state.initialized = true;
        },
        fetchSettingsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.initialized = true;
        },
        updateSettingsRequest: (state, action) => {
            state.loading = true;
            state.data = { ...state.data, ...action.payload };
        },
        updateSettingsSuccess: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
        updateSettingsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
    updateSettingsRequest, updateSettingsSuccess, updateSettingsFailure
} = settingsSlice.actions;

export default settingsSlice.reducer;