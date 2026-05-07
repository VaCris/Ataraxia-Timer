import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CreateTimerDto {
    duration: number;
}

export interface TimerEntity {
    id: string;
    duration: number;
}

export interface TimersState {
    items: TimerEntity[];
    status: 'idle' | 'loading' | 'failed';
    error: string | null;
}

const initialState: TimersState = {
    items: [],
    status: 'idle',
    error: null,
};

export const timersSlice = createSlice({
    name: 'timers',
    initialState,
    reducers: {
        createTimerRequest: (state, _action: PayloadAction<CreateTimerDto>) => {
            state.status = 'loading';
            state.error = null;
        },
        createTimerSuccess: (state, action: PayloadAction<TimerEntity>) => {
            state.status = 'idle';
            state.items.push(action.payload);
            state.error = null;
        },
        createTimerFailure: (state, action: PayloadAction<string>) => {
            state.status = 'failed';
            state.error = action.payload;
        }
    }
});

export const { 
    createTimerRequest, 
    createTimerSuccess, 
    createTimerFailure 
} = timersSlice.actions;

export default timersSlice.reducer;