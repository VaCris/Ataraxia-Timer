import { call, put, takeLatest, all } from 'redux-saga/effects';
import { tasksLocalRepository } from '@/features/tasks/repositories/tasks.local.repository';
import { addToSyncQueue, processSyncQueue } from '@/infrastructure/sync/syncManager';
import {
  fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
  createTaskRequest, createTaskSuccess, createTaskFailure,
  updateTaskRequest, updateTaskSuccess, updateTaskFailure,
  deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} from './tasksSlice';
import { TaskResponse } from '@/features/tasks/types/task.dto';

function* handleFetchTasks() {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      const localTasks: TaskResponse[] = yield call(
        [tasksLocalRepository, tasksLocalRepository.getAll]
      );

      yield put(fetchTasksSuccess(localTasks));
      return;
    }

    if (navigator.onLine) {
      yield call(processSyncQueue);
      
      const localTasks: TaskResponse[] = yield call(
        [tasksLocalRepository, tasksLocalRepository.getAll]
      );
      
      yield put(fetchTasksSuccess(localTasks));
      return;
    }

    const localTasks: TaskResponse[] = yield call(
      [tasksLocalRepository, tasksLocalRepository.getAll]
    );

    yield put(fetchTasksSuccess(localTasks));
  } catch (e: any) {
    try {
      const localTasks: TaskResponse[] = yield call(
        [tasksLocalRepository, tasksLocalRepository.getAll]
      );

      yield put(fetchTasksSuccess(localTasks));
    } catch {
      yield put(fetchTasksFailure(e.response?.data?.message || e.message));
    }
  }
}

function* handleCreateTask(action: ReturnType<typeof createTaskRequest>) {
  const payload = {
    ...action.payload
  };

  try {
    const localTask: TaskResponse = yield call([tasksLocalRepository, tasksLocalRepository.create], payload);

    yield call(addToSyncQueue, {
      method: 'POST',
      url: '/tasks',
      entity: 'tasks',
      entityId: localTask.id,
      data: payload,
    });

    yield put(createTaskSuccess(localTask));
    
    if (navigator.onLine) {
      yield call(processSyncQueue);
    }
  } catch (e: any) {
    yield put(createTaskFailure(e.message));
  }
}

function* handleUpdateTask(action: ReturnType<typeof updateTaskRequest>) {
  try {
    const localTask: TaskResponse = yield call(
      [tasksLocalRepository, tasksLocalRepository.update],
      action.payload.id,
      action.payload.data
    );

    yield call(addToSyncQueue, {
      method: 'PATCH',
      url: `/tasks/${action.payload.id}`,
      entity: 'tasks',
      entityId: action.payload.id,
      data: action.payload.data,
    });

    yield put(updateTaskSuccess(localTask));
    
    if (navigator.onLine) {
      yield call(processSyncQueue);
    }
  } catch (e: any) {
    yield put(updateTaskFailure(e.message));
  }
}

function* handleDeleteTask(action: ReturnType<typeof deleteTaskRequest>) {
  try {
    const shouldSyncDelete: boolean = yield call([tasksLocalRepository, tasksLocalRepository.remove], action.payload);

    if (shouldSyncDelete) {
      yield call(addToSyncQueue, {
        method: 'DELETE',
        url: `/tasks/${action.payload}`,
        entity: 'tasks',
        entityId: action.payload,
      });
    }

    yield put(deleteTaskSuccess(action.payload));
    
    if (navigator.onLine) {
      yield call(processSyncQueue);
    }
  } catch (e: any) {
    yield put(deleteTaskFailure(e.message));
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
