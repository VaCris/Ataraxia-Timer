import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    tags: [],
    loading: false,
    error: null,
    initialized: false
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {

        fetchTasksRequest: (state) => {
            state.loading = true;
        },
        fetchTasksSuccess: (state, action) => {
            state.loading = false;
            state.initialized = true;
            state.tasks = action.payload.tasks;
            state.tags = action.payload.tags;
            state.initialized = true;
        },
        fetchTasksFailure: (state, action) => {
            state.loading = false;
            state.initialized = true;
            state.error = action.payload;
        },

        addTaskRequest: (state, action) => {
            state.tasks.unshift(action.payload);
        },
        addTaskSuccess: (state, action) => {
            const { tempId, realTask } = action.payload;
            state.tasks = state.tasks.map(t => t.id === tempId ? realTask : t);
        },
        addTaskFailure: (state, action) => {
            const { tempId, error } = action.payload;
            state.tasks = state.tasks.filter(t => t.id !== tempId);
            state.error = error;
        },

        updateTaskRequest: (state, action) => {
            const { id, updates } = action.payload;
            state.tasks = state.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
        },
        updateTaskSuccess: (state, action) => {
            const updatedTask = action.payload;
            state.tasks = state.tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
        },

        deleteTaskRequest: (state, action) => {
            const id = action.payload;
            state.tasks = state.tasks.filter(t => t.id !== id);
        },
        deleteTaskFailure: (state, action) => {
            state.error = action.payload;
        },

        addTagSuccess: (state, action) => {
            state.tags.push(action.payload);
        }
    }
});

export const {
    fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
    addTaskRequest, addTaskSuccess, addTaskFailure,
    updateTaskRequest, updateTaskSuccess,
    deleteTaskRequest, deleteTaskFailure,
    addTagSuccess
} = tasksSlice.actions;

export default tasksSlice.reducer;