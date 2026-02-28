import { call, put, takeLatest, take, fork, actionChannel, all } from 'redux-saga/effects';
import { tasksService } from '../../api/tasks.service';
import { tagsService } from '../../api/tags.service';
import {
    fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
    addTaskRequest, addTaskSuccess, addTaskFailure,
    updateTaskRequest, updateTaskSuccess, updateTaskFailure,
    deleteTaskRequest, deleteTaskSuccess, deleteTaskFailure
} from '../slices/tasksSlice';
import { showToast } from '../../utils/customToast';

function* fetchTasksWorker() {
    try {
        const [tasks, tags] = yield all([
            call(tasksService.getAll),
            call(tagsService.getAll)
        ]);
        yield put(fetchTasksSuccess({ tasks, tags }));
    } catch (error) {
        yield put(fetchTasksFailure(error.message));
    }
}

function* watchTaskMutations() {
    const taskChannel = yield actionChannel([
        addTaskRequest.type,
        updateTaskRequest.type,
        deleteTaskRequest.type
    ]);

    while (true) {
        const action = yield take(taskChannel);
        try {
            if (action.type === addTaskRequest.type) {
                const result = yield call(tasksService.create, action.payload);
                yield put(addTaskSuccess({ tempId: action.payload.id, realTask: result }));
            } else if (action.type === updateTaskRequest.type) {
                const { id, updates } = action.payload;
                const result = yield call(tasksService.update, id, updates);
                yield put(updateTaskSuccess(result));
            } else if (action.type === deleteTaskRequest.type) {
                yield call(tasksService.delete, action.payload);
                yield put(deleteTaskSuccess(action.payload));
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Operation failed";
            if (action.type === addTaskRequest.type) yield put(addTaskFailure(msg));
            if (action.type === updateTaskRequest.type) yield put(updateTaskFailure(msg));
            if (action.type === deleteTaskRequest.type) yield put(deleteTaskFailure(msg));

            showToast({
                title: 'Sync Error',
                type: 'error',
                message: Array.isArray(msg) ? msg[0] : msg
            });
        }
    }
}

export function* tasksSaga() {
    yield all([
        takeLatest(fetchTasksRequest.type, fetchTasksWorker),
        fork(watchTaskMutations)
    ]);
}