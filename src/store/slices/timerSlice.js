import { createSlice } from '@reduxjs/toolkit';

const savedState = JSON.parse(localStorage.getItem('timer_state') || 'null');
const initialState = savedState || {
    mode: 'work',
    timeLeft: 25 * 60,
    isActive: false,
    cycles: 0,
    settings: { work: 25, short: 5, long: 15 },
    autoStart: false,
    longBreakInterval: 4,
    volume: 0.5
};

const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setConfig: (state, action) => {
            const { settings, autoStart, longBreakInterval, volume } = action.payload;
            if (settings) {
                state.settings = settings;
                if (!state.isActive) {
                    state.timeLeft = settings[state.mode] * 60;
                }
            }

            if (autoStart !== undefined) state.autoStart = autoStart;
            if (longBreakInterval !== undefined) state.longBreakInterval = longBreakInterval;
            if (volume !== undefined) state.volume = volume;
        },

        startTimer: (state) => {
            state.isActive = true;
        },
        pauseTimer: (state) => {
            state.isActive = false;
        },
        resetTimer: (state) => {
            state.isActive = false;
            state.timeLeft = state.settings[state.mode] * 60;
        },
        tick: (state) => {
            if (state.timeLeft > 0) {
                state.timeLeft -= 1;
            }
        },
        switchMode: (state, action) => {
            const newMode = action.payload;
            state.mode = newMode;
            state.timeLeft = state.settings[newMode] * 60;
            state.isActive = false;
        },
        incrementCycles: (state) => {
            state.cycles += 1;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        }
    }
});

export const {
    setConfig, startTimer, pauseTimer,
    resetTimer, tick, switchMode, incrementCycles, setVolume
} = timerSlice.actions;

export default timerSlice.reducer;