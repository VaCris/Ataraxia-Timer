import { call, put, takeLatest, all } from 'redux-saga/effects';
import { settingsService } from '../../api/settings.service';
import {
    fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
    updateSettingsRequest, updateSettingsSuccess, updateSettingsFailure
} from '../slices/settingsSlice';
import { showToast } from '../../utils/customToast';

function* fetchSettingsWorker() {
    try {
        const settings = yield call(settingsService.getSettings);
        yield put(fetchSettingsSuccess(settings));
    } catch (error) {
        yield put(fetchSettingsFailure(error.message));
    }
}

function* updateSettingsWorker(action) {
    try {
        const settings = yield call(settingsService.updateSettings, action.payload);
        yield put(updateSettingsSuccess(settings));
        showToast({
            title: 'Settings Saved',
            type: 'success',
            message: 'Your preferences have been updated.'
        });
    } catch (error) {
        const msg = error.response?.data?.message;
        yield put(updateSettingsFailure(error.message));
        showToast({
            title: 'Settings Error',
            type: 'error',
            message: Array.isArray(msg) ? msg[0] : (msg || 'Could not save changes')
        });
    }
}

export function* settingsSaga() {
    yield all([
        takeLatest(fetchSettingsRequest.type, fetchSettingsWorker),
        takeLatest(updateSettingsRequest.type, updateSettingsWorker)
    ]);
}