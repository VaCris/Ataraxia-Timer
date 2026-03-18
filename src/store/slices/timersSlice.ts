import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TimerEntity { id: string; duration: number }

interface TimersState {
    items: TimerEntity[]
    status: 'idle' | 'loading' | 'failed'
    error?: string
}

const initialState: TimersState = { items: [], status: 'idle' }

const slice = createSlice({
    name: 'timers',
    initialState,
    reducers: {
        createTimerRequest: (s, _a: PayloadAction<any>) => { s.status = 'loading' },
        createTimerSuccess: (s, a: PayloadAction<TimerEntity>) => {
            s.status = 'idle'
            s.items.push(a.payload)
        },
        createTimerFailure: (s, a: PayloadAction<string>) => {
            s.status = 'failed'
            s.error = a.payload
        }
    }
})

export const { createTimerRequest, createTimerSuccess, createTimerFailure } = slice.actions
export default slice.reducer