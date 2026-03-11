import { call, put, takeLatest } from 'redux-saga/effects';
import { tasksService } from '@api/tasks/tasks.service';
import { 
    fetchTasksRequest, fetchTasksSuccess, createTaskRequest, 
    taskActionFailure 
} from '../slices/tasksSlice';

function* handleFetchTasks(): Generator {
    try {
        const data = yield call(tasksService.getAll);
        yield put(fetchTasksSuccess(data as any[]));
    } catch (e: any) {
        yield put(taskActionFailure(e.message));
    }
}

function* handleCreateTask(action: ReturnType<typeof createTaskRequest>): Generator {
    try {
        const createdTask = yield call(tasksService.create, action.payload);
        yield put(fetchTasksRequest()); 
    } catch (e: any) {
        yield put(taskActionFailure(e.message));
    }
}

export function* taskSaga() {
    yield takeLatest(fetchTasksRequest.type, handleFetchTasks);
    yield takeLatest(createTaskRequest.type, handleCreateTask);
}