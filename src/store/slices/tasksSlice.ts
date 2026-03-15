import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskResponse, CreateTaskDto, UpdateTaskDto } from '@api/tasks/dto/task.dto';

interface TaskState {
  items: TaskResponse[];
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
    fetchTasksRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess: (state, action: PayloadAction<TaskResponse[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchTasksFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    createTaskRequest: (state, _action: PayloadAction<CreateTaskDto>) => {
      state.loading = true;
    },
    createTaskSuccess: (state, action: PayloadAction<TaskResponse>) => {
      state.loading = false;
      state.items.push(action.payload);
    },
    createTaskFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTaskRequest: (state, _action: PayloadAction<{ id: string; data: UpdateTaskDto }>) => {
      state.loading = true;
    },
    updateTaskSuccess: (state, action: PayloadAction<TaskResponse>) => {
      state.loading = false;
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    updateTaskFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTaskRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    deleteTaskSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    deleteTaskFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
  createTaskRequest, createTaskSuccess, createTaskFailure,
  updateTaskRequest, updateTaskSuccess, updateTaskFailure,
  deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} = taskSlice.actions;

export default taskSlice.reducer;