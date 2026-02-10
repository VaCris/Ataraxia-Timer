import { call, put, takeLatest, select, all } from 'redux-saga/effects';
import { tasksService } from '../../api/tasks.service';
import { tagsService } from '../../api/tags.service';
import {
    fetchTasksRequest, fetchTasksSuccess, fetchTasksFailure,
    addTaskRequest, addTaskSuccess, addTaskFailure,
    updateTaskRequest, updateTaskSuccess,
    deleteTaskRequest, deleteTaskFailure,
    addTagSuccess
} from '../slices/tasksSlice';
import { syncManager } from '../../api/sync.manager';

function* fetchTasksSaga() {
    try {
        const [tasks, tags] = yield all([
            call(tasksService.getAll),
            call(tagsService.getAll)
        ]);
        yield put(fetchTasksSuccess({ tasks: tasks || [], tags: tags || [] }));
    } catch (error) {
        yield put(fetchTasksFailure(error.message));
    }
}

function* addTaskSaga(action) {
    const { id: tempId, title, tag, tagColor } = action.payload;
    try {
        if (navigator.onLine) {
            const currentTags = yield select(state => state.tasks.tags);
            const exists = currentTags.find(t => t.name.toLowerCase() === tag.toLowerCase());
            
            if (!exists) {
                try {
                    const newTag = yield call(tagsService.create, { name: tag, color: tagColor });
                    yield put(addTagSuccess(newTag));
                } catch (e) {
                    console.warn("Could not create tag automatically", e);
                }
            }
        }

        const result = yield call(tasksService.create, { title, tag });
        
        yield put(addTaskSuccess({ tempId, realTask: result }));

    } catch (error) {
        yield put(addTaskFailure({ tempId, error: error.message }));
    }
}

function* updateTaskSaga(action) {
    const { id, updates } = action.payload;
    try {
        const result = yield call(tasksService.update, id, updates);
        yield put(updateTaskSuccess(result));
    } catch (error) {
        console.error("Update failed", error);
    }
}

function* deleteTaskSaga(action) {
    const id = action.payload;
    const isOfflineTask = id.toString().startsWith('temp_');

    try {
        if (isOfflineTask) {
            yield call([syncManager, 'removeFromQueue'], 'outbox_tasks', id);
        } else {
            yield call(tasksService.delete, id);
        }
    } catch (error) {
        yield put(deleteTaskFailure(error.message));
    }
}

export function* tasksSaga() {
    yield all([
        takeLatest(fetchTasksRequest.type, fetchTasksSaga),
        takeLatest(addTaskRequest.type, addTaskSaga),
        takeLatest(updateTaskRequest.type, updateTaskSaga),
        takeLatest(deleteTaskRequest.type, deleteTaskSaga),
    ]);
}