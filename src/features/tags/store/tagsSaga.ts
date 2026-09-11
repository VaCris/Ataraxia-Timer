import { call, put, takeLatest, all, delay } from 'redux-saga/effects';
import { toast } from 'react-hot-toast';
import { LocalTagModel } from '@/infrastructure/database/db';
import { tagsLocalRepository } from '../repositories/tags.local.repository';
import { TagResponse } from '@/features/tags/types/tag.dto';
import { addToSyncQueue, processSyncQueue } from '@/infrastructure/sync/syncManager';
import {
    fetchTagsRequest, fetchTagsSuccess, fetchTagsFailure,
    addTagRequest, addTagSuccess,
    updateTagRequest, updateTagSuccess,
    deleteTagRequest, deleteTagSuccess,
    tagsOperationFailure
} from './tagsSlice';
import { TAG_POLL_INTERVAL } from '../constants/tags.constants';

function* pollServerTags(): Generator<any, void, any> {
    while (true) {
        try {
            yield delay(TAG_POLL_INTERVAL);

            const token = localStorage.getItem('token');
            if (!token || !navigator.onLine) continue;

            const { TagControllerService } = yield import('@/infrastructure/api/generated');
            const serverTags: TagResponse[] = yield call([TagControllerService, 'getTags']);

            if (Array.isArray(serverTags) && serverTags.length > 0) {
                const localTags: LocalTagModel[] = yield call([tagsLocalRepository, tagsLocalRepository.getAll]);
                const localMap = new Map(localTags.map((tag) => [tag.id, tag]));

                for (const serverTag of serverTags) {
                    if (!serverTag.id) continue;
                    const existing = localMap.get(serverTag.id);
                    if (!existing || existing.syncStatus === 'synced') {
                        yield call([tagsLocalRepository, tagsLocalRepository.create], {
                            ...serverTag,
                            syncStatus: 'synced',
                            updatedAt: Date.now(),
                            deletedAt: null,
                        } as LocalTagModel);
                    }
                }

                const merged: LocalTagModel[] = yield call([tagsLocalRepository, tagsLocalRepository.getAll]);
                yield put(fetchTagsSuccess(merged));
            }
        } catch {
            // Polling is best-effort; local tags remain the source of truth.
        }
    }
}

function* handleFetchTags(): Generator<any, void, any> {
    try {
        const token = localStorage.getItem('token');
        if (token && navigator.onLine) yield call(processSyncQueue);

        const localTags: LocalTagModel[] = yield call([tagsLocalRepository, tagsLocalRepository.getAll]);
        yield put(fetchTagsSuccess(localTags));
    } catch (e: any) {
        try {
            const localTags: LocalTagModel[] = yield call([tagsLocalRepository, tagsLocalRepository.getAll]);
            yield put(fetchTagsSuccess(localTags));
        } catch {
            yield put(fetchTagsFailure(e.message));
        }
    }
}

function* handleAddTag(action: any): Generator<any, void, any> {
    try {
        const tempId = action.payload.id || `local-tag-${Date.now()}`;
        const newTag: TagResponse = {
            id: tempId,
            name: action.payload.name,
            color: action.payload.color
        };

        yield call([tagsLocalRepository, tagsLocalRepository.create], {
            ...newTag,
            syncStatus: 'pending_create',
            updatedAt: Date.now()
        } as LocalTagModel);

        yield put(addTagSuccess(newTag));
        toast.success('Category ready');

        yield call(addToSyncQueue, {
            method: 'POST',
            url: '/tags',
            entity: 'tags',
            entityId: tempId,
            data: action.payload
        });

        if (navigator.onLine) yield call(processSyncQueue);
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Failed to create category');
    }
}

function* handleUpdateTag(action: any): Generator<any, void, any> {
    try {
        const { id, data } = action.payload;

        yield call([tagsLocalRepository, tagsLocalRepository.update], id, {
            ...data,
            syncStatus: 'pending_update'
        });

        yield put(updateTagSuccess({ id, ...data }));
        toast.success('Category updated');

        yield call(addToSyncQueue, {
            method: 'PATCH',
            url: `/tags/${id}`,
            entity: 'tags',
            entityId: id,
            data
        });

        if (navigator.onLine) yield call(processSyncQueue);
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Update failed');
    }
}

function* handleDeleteTag(action: any): Generator<any, void, any> {
    try {
        const id = action.payload;
        const shouldSyncDelete: boolean = yield call([tagsLocalRepository, tagsLocalRepository.delete], id);
        yield put(deleteTagSuccess(id));
        toast.success('Category removed');

        if (shouldSyncDelete) {
            yield call(addToSyncQueue, {
                method: 'DELETE',
                url: `/tags/${id}`,
                entity: 'tags',
                entityId: id
            });
        }

        if (navigator.onLine) yield call(processSyncQueue);
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
        pollServerTags(),
    ]);
}
