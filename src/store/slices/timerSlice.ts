import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TimerResponse, CreateTimerDto, UpdateTimerDto } from '@/api/timers/dto/timer.dto'

type TimerState = {
    items: TimerResponse[]
    status: 'idle' | 'loading' | 'error'
    error: string | null
}

const initialState: TimerState = { items: [], status: 'idle', error: null }

const slice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        fetchTimersRequest: (s) => { s.status = 'loading'; s.error = null },
        fetchTimersSuccess: (s, a: PayloadAction<TimerResponse[]>) => { s.status = 'idle'; s.items = a.payload },
        fetchTimersFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

        createTimerRequest: (s, _a: PayloadAction<CreateTimerDto>) => { s.status = 'loading'; s.error = null },
        createTimerSuccess: (s, a: PayloadAction<TimerResponse>) => { s.status = 'idle'; s.items.push(a.payload) },
        createTimerFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

        updateTimerRequest: (s, _a: PayloadAction<{ id: string; data: UpdateTimerDto }>) => { s.status = 'loading'; s.error = null },
        updateTimerSuccess: (s, a: PayloadAction<TimerResponse>) => {
            s.status = 'idle'
            s.items = s.items.map(i => i.id === a.payload.id ? a.payload : i)
        },
        updateTimerFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

        deleteTimerRequest: (s, _a: PayloadAction<string>) => { s.status = 'loading'; s.error = null },
        deleteTimerSuccess: (s, a: PayloadAction<string>) => { s.status = 'idle'; s.items = s.items.filter(i => i.id !== a.payload) },
        deleteTimerFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload }
    }
})

export const {
    fetchTimersRequest, fetchTimersSuccess, fetchTimersFailure,
    createTimerRequest, createTimerSuccess, createTimerFailure,
    updateTimerRequest, updateTimerSuccess, updateTimerFailure,
    deleteTimerRequest, deleteTimerSuccess, deleteTimerFailure
} = slice.actions

export default slice.reducer