import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateTaskDto, UpdateTaskDto } from '@api/tasks/dto/task.dto';

interface TaskState {
    items: any[];
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    items: [],
    loading: false,
    error: null,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        fetchTasksRequest: (state) => { state.loading = true; },
        fetchTasksSuccess: (state, action: PayloadAction<any[]>) => {
            state.loading = false;
            state.items = action.payload;
        },
        createTaskRequest: (state, _action: PayloadAction<CreateTaskDto>) => { state.loading = true; },
        updateTaskRequest: (state, _action: PayloadAction<{id: string, data: UpdateTaskDto}>) => { state.loading = true; },
        taskActionSuccess: (state) => { state.loading = false; },
        taskActionFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { 
    fetchTasksRequest, fetchTasksSuccess, createTaskRequest, 
    updateTaskRequest, taskActionSuccess, taskActionFailure 
} = taskSlice.actions;
export default taskSlice.reducer;