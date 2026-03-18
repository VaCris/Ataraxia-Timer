import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Mode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'

interface TimerState {
    mode: Mode
    isActive: boolean
    timeLeft: number
    initialTime: number
    toast: { isOpen: boolean; message: string }
}

const initialState: TimerState = {
    mode: 'FOCUS',
    isActive: false,
    timeLeft: 1500,
    initialTime: 1500,
    toast: { isOpen: false, message: '' }
}

const slice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setMode: (s, a: PayloadAction<Mode>) => { s.mode = a.payload },
        toggleTimer: (s) => { s.isActive = !s.isActive },
        resetTimer: (s, a: PayloadAction<number>) => {
            s.isActive = false
            s.initialTime = a.payload
            s.timeLeft = a.payload
        },
        tick: (s) => { if (s.timeLeft > 0) s.timeLeft-- },
        updateDurations: (s, a: PayloadAction<{ mode: Mode; duration: number }>) => {
            const seconds = a.payload.duration * 60
            s.initialTime = seconds
            s.timeLeft = seconds
        },
        showToast: (s, a: PayloadAction<string>) => {
            s.toast = { isOpen: true, message: a.payload }
        },
        hideToast: (s) => { s.toast.isOpen = false }
    }
})

export const {
    setMode,
    toggleTimer,
    resetTimer,
    tick,
    updateDurations,
    showToast,
    hideToast
} = slice.actions

export default slice.reducer