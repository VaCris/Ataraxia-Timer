import { call, put, takeLatest, all } from 'redux-saga/effects';
import { tasksService } from '@api/tasks/tasks.service';
import {
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
  createTaskRequest, createTaskSuccess, createTaskFailure,
  updateTaskRequest, updateTaskSuccess, updateTaskFailure,
  deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} from './tasksSlice';
import { TaskResponse } from '@/features/tasks/types/task.dto';

function* handleFetchTasks() {
  try {
    const data: TaskResponse[] = yield call(tasksService.getAll);
    yield put(fetchTasksSuccess(data));
  } catch (e: any) {
    yield put(fetchTasksFailure(e.response?.data?.message || e.message));
  }
}

function* handleCreateTask(action: ReturnType<typeof createTaskRequest>) {
  try {
    const payload = {
      ...action.payload,
      tag: action.payload.tag?.trim() || 'General'
    };
    const data: TaskResponse = yield call(tasksService.create, payload);
    yield put(createTaskSuccess(data));
  } catch (e: any) {
    yield put(createTaskFailure(e.response?.data?.message || e.message));
  }
}

function* handleUpdateTask(action: ReturnType<typeof updateTaskRequest>) {
  try {
    const data: TaskResponse = yield call(tasksService.update, action.payload.id, action.payload.data);
    yield put(updateTaskSuccess(data));
  } catch (e: any) {
    yield put(updateTaskFailure(e.response?.data?.message || e.message));
  }
}

function* handleDeleteTask(action: ReturnType<typeof deleteTaskRequest>) {
  try {
    yield call(tasksService.delete, action.payload);
    yield put(deleteTaskSuccess(action.payload));
  } catch (e: any) {
    yield put(deleteTaskFailure(e.response?.data?.message || e.message));
  }
}

export function* taskSaga() {
  yield all([
    takeLatest(fetchTasksRequest.type, handleFetchTasks),
    takeLatest(createTaskRequest.type, handleCreateTask),
    takeLatest(updateTaskRequest.type, handleUpdateTask),
    takeLatest(deleteTaskRequest.type, handleDeleteTask),
  ]);
}