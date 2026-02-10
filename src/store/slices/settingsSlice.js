import { createSlice } from '@reduxjs/toolkit';
const savedColor = localStorage.getItem('dw-color');
const savedBg = localStorage.getItem('dw-background');
const savedIs24Hour = localStorage.getItem('dw-is24hour') === 'true';

const initialState = {
    timerSettings: { work: 25, short: 5, long: 15 },
    autoStart: false,
    longBreakInterval: 4,

    accentColor: savedColor || '#8b5cf6',
    bgImage: savedBg || '',
    is24Hour: savedIs24Hour,
    volume: 0.5,

    loading: false,
    error: null,
    initialized: false
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
            state.initialized = true;
            if (action.payload) {
                const s = action.payload;
                if (s.focusDuration) state.timerSettings.work = s.focusDuration;
                if (s.shortBreakDuration) state.timerSettings.short = s.shortBreakDuration;
                if (s.longBreakDuration) state.timerSettings.long = s.longBreakDuration;
                if (s.autoStartPomodoros !== undefined) state.autoStart = s.autoStartPomodoros;
                if (s.longBreakInterval) state.longBreakInterval = s.longBreakInterval;

            }
        },
        fetchSettingsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateSettings: (state, action) => {
            return { ...state, ...action.payload };
        },
        updateTimerSettings: (state, action) => {
            state.timerSettings = { ...state.timerSettings, ...action.payload };
        }
    }
});

export const {
    fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
    updateSettings, updateTimerSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;