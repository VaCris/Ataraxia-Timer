import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('ataraxia-settings')) || {
    timerSettings: { FOCUS: 25, SHORT_BREAK: 5, LONG_BREAK: 15 },
    autoStartBreak: false,
    autoStartFocus: false,
    longBreakInterval: 4,
    accentColor: '#8b5cf6',
    bgImage: '',
    blurIntensity: 10,
    is24Hour: true,
    alarmSound: 'bell'
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateSettings: (state, action) => {
            const newState = { ...state, ...action.payload };
            localStorage.setItem('ataraxia-settings', JSON.stringify(newState));
            return newState;
        },
        updateTimerSettings: (state, action) => {
            state.timerSettings = action.payload;
            localStorage.setItem('ataraxia-settings', JSON.stringify(state));
        }
    }
});


export const { updateSettings, updateTimerSettings } = settingsSlice.actions;
export default settingsSlice.reducer;