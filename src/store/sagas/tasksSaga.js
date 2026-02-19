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

function* safeGetTasks() {
    try { return yield call(tasksService.getAll); }
    catch (e) { return []; }
}

function* safeGetTags() {
    try { return yield call(tagsService.getAll); }
    catch (e) { return []; }
}

function* fetchTasksSaga() {
    try {
        const [tasks, tags] = yield all([
            call(safeGetTasks),
            call(safeGetTags)
        ]);

        yield put(fetchTasksSuccess({ tasks, tags }));
    } catch (error) {
        console.error({ error: "Fetch tasks failed" });
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
                } catch (error) {
                    console.warn({ error: "Tag creation failed, proceeding without tag" });
                }
            }
        }

        const taskPayload = { title: title.trim(), tag: tag.trim() };

        const result = yield call(tasksService.create, taskPayload);

        yield put(addTaskSuccess({ tempId, realTask: result }));

    } catch (error) {
        console.error({ error: "Add task failed" });
        yield put(addTaskFailure({ tempId, error: error.message }));
    }
}

function* updateTaskSaga(action) {
    const { id, updates } = action.payload;
    try {
        const result = yield call(tasksService.update, id, updates);
        yield put(updateTaskSuccess(result));
    } catch (error) {
        console.error({ error: "Update task failed" });
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