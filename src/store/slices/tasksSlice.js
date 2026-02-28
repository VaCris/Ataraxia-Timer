import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        items: [],
        tags: [],
        loading: false,
        error: null,
        initialized: false
    },
    reducers: {
        fetchTasksRequest: (state) => { state.loading = true; },
        fetchTasksSuccess: (state, action) => {
            state.loading = false;
            state.items = action.payload.tasks || [];
            state.tags = action.payload.tags || [];
            state.initialized = true;
        },
        fetchTasksFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.initialized = true;
        },
        addTaskRequest: (state) => { state.loading = true; },
        addTaskSuccess: (state, action) => {
            state.loading = false;
            const { tempId, realTask } = action.payload;
            state.items = state.items.map(item => item.id === tempId ? realTask : item);
        },
        addTaskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateTaskRequest: (state) => { state.loading = true; },
        updateTaskSuccess: (state, action) => {
            state.loading = false;
            const index = state.items.findIndex(i => i.id === action.payload.id);
            if (index !== -1) state.items[index] = action.payload;
        },
        updateTaskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteTaskRequest: (state) => { state.loading = true; },
        deleteTaskSuccess: (state, action) => {
            state.loading = false;
            state.items = state.items.filter(i => i.id !== action.payload);
        },
        deleteTaskFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {
    fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
    addTaskRequest, addTaskSuccess, addTaskFailure,
    updateTaskRequest, updateTaskSuccess, updateTaskFailure,
    deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} = tasksSlice.actions;

export default tasksSlice.reducer;