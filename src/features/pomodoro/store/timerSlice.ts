import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Mode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'

interface TimerState {
    mode: Mode
    isActive: boolean
    isPaused: boolean
    timeLeft: number
    initialTime: number
    toast: { isOpen: boolean; message: string }
}

const DEFAULT_FOCUS_TIME = 25 * 60

const initialState: TimerState = {
    mode: 'FOCUS',
    isActive: false,
    isPaused: false,
    timeLeft: DEFAULT_FOCUS_TIME,
    initialTime: DEFAULT_FOCUS_TIME,
    toast: { isOpen: false, message: '' },
}

const slice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload
        },

        startTimer: (state) => {
            state.isActive = true
            state.isPaused = false
        },
        pauseTimer: (state) => {
            state.isActive = false
            state.isPaused = true
        },

        resumeTimer: (state) => {
            if (state.timeLeft > 0) {
                state.isActive = true
                state.isPaused = false
            }
        },
        stopTimer: (state) => {
            state.isActive = false
            state.isPaused = false
        },

        toggleTimer: (state) => {
            state.isActive = !state.isActive
        },

        resetTimer: (state, action: PayloadAction<number>) => {
            state.isActive = false
            state.isPaused = false
            state.initialTime = action.payload
            state.timeLeft = action.payload
        },

        tick: (state) => {
            if (state.timeLeft > 0) {
                state.timeLeft -= 1
            }
        },

        updateDurations: (
            state,
            action: PayloadAction<{ mode: Mode; duration: number }>
        ) => {
            const seconds = action.payload.duration * 60

            state.mode = action.payload.mode
            state.isActive = false
            state.isPaused = false
            state.initialTime = seconds
            state.timeLeft = seconds
        },

        showToast: (state, action: PayloadAction<string>) => {
            state.toast = { isOpen: true, message: action.payload }
        },

        hideToast: (state) => {
            state.toast.isOpen = false
        },
    },
})

export const {
    setMode,
    startTimer,
    stopTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    updateDurations,
    showToast,
    hideToast,
} = slice.actions

export default slice.reducer
