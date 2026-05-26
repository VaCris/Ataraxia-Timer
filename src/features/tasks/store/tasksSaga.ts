import { call, put, takeLatest, all } from 'redux-saga/effects';
import { tasksService } from '@/features/tasks/api/tasks.api';
import { tasksLocalRepository } from '@/features/tasks/repositories/tasks.local.repository';
import { addToSyncQueue, processSyncQueue } from '@/infrastructure/sync/syncManager';
import {
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
  createTaskRequest, createTaskSuccess, createTaskFailure,
  updateTaskRequest, updateTaskSuccess, updateTaskFailure,
  deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} from './tasksSlice';
import { TaskResponse } from '@/features/tasks/types/task.dto';

const isNetworkError = (error: any) =>
  error.message === 'Network Error' || error.code === 'ERR_NETWORK' || !navigator.onLine;

function* handleFetchTasks() {
  try {
    if (navigator.onLine) {
      yield call(processSyncQueue);

      const data: TaskResponse[] = yield call(tasksService.getAll);
      yield call([tasksLocalRepository, tasksLocalRepository.replaceAll], data);
      yield put(fetchTasksSuccess(data));
      return;
    }

    const localTasks: TaskResponse[] = yield call([tasksLocalRepository, tasksLocalRepository.getAll]);
    yield put(fetchTasksSuccess(localTasks));
  } catch (e: any) {
    try {
      const localTasks: TaskResponse[] = yield call([tasksLocalRepository, tasksLocalRepository.getAll]);
      yield put(fetchTasksSuccess(localTasks));
    } catch {
      yield put(fetchTasksFailure(e.response?.data?.message || e.message));
    }
  }
}

function* handleCreateTask(action: ReturnType<typeof createTaskRequest>) {
  const payload = {
    ...action.payload,
    tag: action.payload.tag?.trim() || 'General'
  };

  try {
    if (navigator.onLine) {
      const data: TaskResponse = yield call(tasksService.create, payload);
      yield call([tasksLocalRepository, tasksLocalRepository.createFromRemote], data);
      yield put(createTaskSuccess(data));
      return;
    }

    throw new Error('Network Error');
  } catch (e: any) {
    if (!isNetworkError(e)) {
      yield put(createTaskFailure(e.response?.data?.message || e.message));
      return;
    }

    const localTask: TaskResponse = yield call([tasksLocalRepository, tasksLocalRepository.create], payload);

    yield call(addToSyncQueue, {
      method: 'POST',
      url: '/tasks',
      data: payload,
      entity: 'tasks',
      entityId: localTask.id,
    });

    yield put(createTaskSuccess(localTask));
  }
}

function* handleUpdateTask(action: ReturnType<typeof updateTaskRequest>) {
  try {
    const localTask: TaskResponse = yield call(
      [tasksLocalRepository, tasksLocalRepository.update],
      action.payload.id,
      action.payload.data
    );

    yield put(updateTaskSuccess(localTask));

    if (navigator.onLine && !action.payload.id.startsWith('local-')) {
      try {
        const data: TaskResponse = yield call(
          tasksService.update,
          action.payload.id,
          action.payload.data
        );

        yield call([tasksLocalRepository, tasksLocalRepository.updateFromRemote], data);
        yield put(updateTaskSuccess(data));
        return;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }

    yield call(addToSyncQueue, {
      method: 'PATCH',
      url: `/tasks/${action.payload.id}`,
      data: action.payload.data,
      entity: 'tasks',
      entityId: action.payload.id,
    });
  } catch (e: any) {
    yield put(updateTaskFailure(e.response?.data?.message || e.message));
  }
}

function* handleDeleteTask(action: ReturnType<typeof deleteTaskRequest>) {
  try {
    yield call([tasksLocalRepository, tasksLocalRepository.remove], action.payload);
    yield put(deleteTaskSuccess(action.payload));

    if (navigator.onLine) {
      try {
        yield call(tasksService.delete, action.payload);
        yield call([tasksLocalRepository, tasksLocalRepository.removeSynced], action.payload);
        return;
      } catch (error: any) {
        if (!isNetworkError(error)) throw error;
      }
    }

    yield call(addToSyncQueue, {
      method: 'DELETE',
      url: `/tasks/${action.payload}`,
      entity: 'tasks',
      entityId: action.payload,
    });
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
