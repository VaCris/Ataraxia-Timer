import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PomodoroState {
    timeLeft: number
    isActive: boolean
    initialTime: number
    currentTaskId?: string
}

const initialState: PomodoroState = {
    timeLeft: 1500,
    isActive: false,
    initialTime: 1500
}

const pomodoroSlice = createSlice({
    name: 'pomodoro',
    initialState,
    reducers: {
        setTimeLeft: (s, a: PayloadAction<number>) => { s.timeLeft = a.payload },
        toggleActive: (s) => { s.isActive = !s.isActive },
        reset: (s) => {
            s.isActive = false
            s.timeLeft = s.initialTime
        },
        setInitialTime: (s, a: PayloadAction<number>) => {
            s.initialTime = a.payload
            s.timeLeft = a.payload
        },
        setTask: (s, a: PayloadAction<string | undefined>) => {
            s.currentTaskId = a.payload
        }
    }
})

export const {
    setTimeLeft, toggleActive, reset, setInitialTime, setTask
} = pomodoroSlice.actions

export default pomodoroSlice.reducer