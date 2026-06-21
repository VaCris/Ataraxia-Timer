import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
    CreateTimerDto,
    TimerResponse,
} from '@/features/pomodoro/types/timer.dto'

export interface TimersState {
    items: TimerResponse[]
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: TimersState = {
    items: [],
    status: 'idle',
    error: null,
}

export const timersSlice = createSlice({
    name: 'timers',
    initialState,
    reducers: {
        createTimerRequest: (state, _action: PayloadAction<CreateTimerDto>) => {
            state.status = 'loading'
            state.error = null
        },

        createTimerSuccess: (state, action: PayloadAction<TimerResponse>) => {
            state.status = 'idle'
            state.items.push(action.payload)
            state.error = null
        },

        createTimerFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed'
            state.error = action.payload
        },
    },
})

export const {
    createTimerRequest,
    createTimerSuccess,
    createTimerFailure,
} = timersSlice.actions

export default timersSlice.reducer