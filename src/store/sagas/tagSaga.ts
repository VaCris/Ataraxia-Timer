import { call, put, takeLatest, all } from 'redux-saga/effects';
import { tagsService } from '@api/tags/tags.service';
import { TagResponse } from '@api/tags/dto/tag.dto';
import { toast } from 'react-hot-toast';
import {
    fetchTagsRequest, fetchTagsSuccess, fetchTagsFailure,
    addTagRequest, addTagSuccess,
    updateTagRequest, updateTagSuccess,
    deleteTagRequest, deleteTagSuccess,
    tagsOperationFailure
} from '../slices/tagsSlice';

function* handleFetchTags() {
    try {
        const data: TagResponse[] = yield call(tagsService.getAll);
        yield put(fetchTagsSuccess(data));
    } catch (e: any) {
        yield put(fetchTagsFailure(e.message));
    }
}

function* handleAddTag(action: any) {
    try {
        const newTag: TagResponse = yield call(tagsService.create, action.payload);
        yield put(addTagSuccess(newTag));
        toast.success(`Category "${newTag.name}" ready`);
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Failed to create category');
    }
}

function* handleUpdateTag(action: any) {
    try {
        const updated: TagResponse = yield call(tagsService.update, action.payload.id, action.payload.data);
        yield put(updateTagSuccess(updated));
        toast.success('Category updated');
    } catch (e: any) {
        yield put(tagsOperationFailure(e.message));
        toast.error('Update failed');
    }
}

function* handleDeleteTag(action: any) {
    try {
        yield call(tagsService.delete, action.payload);
        yield put(deleteTagSuccess(action.payload));
        toast.success('Category removed');
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