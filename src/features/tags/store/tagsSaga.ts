import { call, put, takeLatest, all } from 'redux-saga/effects';
import { toast } from 'react-hot-toast';
import { db } from '@/infrastructure/database/db';
import { tagsLocalRepository } from '../repositories/tags.local.repository';
import { tagsService } from '../api/tags.api';
import { TagResponse } from '@/features/tags/types/tag.dto';
import { v4 as uuidv4 } from 'uuid';
import {
    fetchTagsRequest, fetchTagsSuccess, fetchTagsFailure,
    addTagRequest, addTagSuccess,
    updateTagRequest, updateTagSuccess,
    deleteTagRequest, deleteTagSuccess,
    tagsOperationFailure
} from './tagsSlice';

function* handleFetchTags() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            const localTags: TagResponse[] = yield call(tagsLocalRepository.getAll);
            yield put(fetchTagsSuccess(localTags));
            return;
        }

        if (navigator.onLine) {
            const data: TagResponse[] = yield call(tagsService.getAll);
            yield call([tagsLocalRepository, tagsLocalRepository.replaceAll], data);
            yield put(fetchTagsSuccess(data));
            return;
        }

        const localTags: TagResponse[] = yield call(tagsLocalRepository.getAll);
        yield put(fetchTagsSuccess(localTags));
    } catch (e: any) {
        try {
            const localTags: TagResponse[] = yield call(tagsLocalRepository.getAll);
            yield put(fetchTagsSuccess(localTags));
        } catch {
            yield put(fetchTagsFailure(e.message));
        }
    }
}

function* handleAddTag(action: any) {
    try {
        const tempId = `local-tag-${Date.now()}`;
        const newTag: TagResponse = {
            id: tempId,
            ...action.payload,
        };

        yield call(tagsLocalRepository.create, {
            ...newTag,
            syncStatus: 'pending_create',
            updatedAt: Date.now()
        });

        yield put(addTagSuccess(newTag));
        toast.success(`Category ready`);

        yield call([db.syncQueue, db.syncQueue.put], {
            id: uuidv4(),
            method: 'POST',
            url: '/tags',
            entity: 'tags',
            entityId: tempId,
            data: action.payload,
            retries: 0,
            ts: Date.now()
        });
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Failed to create category');
    }
}

function* handleUpdateTag(action: any) {
    try {
        const { id, data } = action.payload;

        yield call(tagsLocalRepository.update, id, {
            ...data,
            syncStatus: 'pending_update'
        });

        yield put(updateTagSuccess({ id, ...data }));
        toast.success('Category updated');

        yield call([db.syncQueue, db.syncQueue.put], {
            id: uuidv4(),
            method: 'PATCH',
            url: `/tags/${id}`,
            entity: 'tags',
            entityId: id,
            data: data,
            retries: 0,
            ts: Date.now()
        });
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Update failed');
    }
}

function* handleDeleteTag(action: any) {
    try {
        const id = action.payload;
        yield call(tagsLocalRepository.delete, id);
        yield put(deleteTagSuccess(id));
        toast.success('Category removed');

        yield call([db.syncQueue, db.syncQueue.put], {
            id: uuidv4(),
            method: 'DELETE',
            url: `/tags/${id}`,
            entity: 'tags',
            entityId: id,
            retries: 0,
            ts: Date.now()
        });
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Could not delete category');
    }
}

export default function* tagSaga() {
    yield all([
        takeLatest(fetchTagsRequest.type, handleFetchTags),
        takeLatest(addTagRequest.type, handleAddTag),
        takeLatest(updateTagRequest.type, handleUpdateTag),
        takeLatest(deleteTagRequest.type, handleDeleteTag),
    ]);
}