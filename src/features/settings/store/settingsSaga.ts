import { call, put, takeLatest, all } from 'redux-saga/effects';

import { settingsService } from '@/features/settings/api/settings.api';
import { addToSyncQueue } from '@/infrastructure/sync/syncManager';
import {
  fetchSettingsRequest,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  fetchAllSettingsRequest,
  fetchAllSettingsSuccess,
  fetchAllSettingsFailure,
  createSettingsRequest,
  createSettingsSuccess,
  createSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
  deleteSettingsRequest,
  deleteSettingsSuccess,
  deleteSettingsFailure,
  adminUpdateSettingsRequest,
  adminUpdateSettingsSuccess,
  adminUpdateSettingsFailure,
} from './settingsSlice';

const sanitizeSettings = (payload: any) => ({
  focusDuration: payload.focusDuration,
  shortBreakDuration: payload.shortBreakDuration,
  longBreakDuration: payload.longBreakDuration,
  autoStartBreaks: payload.autoStartBreaks,
  autoStartPomodoros: payload.autoStartPomodoros,
  longBreakInterval: payload.longBreakInterval,
  theme: ['light', 'dark', 'system'].includes(payload.theme)
    ? payload.theme
    : 'dark',
  soundEnabled: payload.soundEnabled ?? true,
  platform: payload.platform || 'web',
});

function* fetchSettingsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(settingsService.get);
    yield put(fetchSettingsSuccess(response));
  } catch (error: any) {
    yield put(
      fetchSettingsFailure(
        error.response?.data?.message || error.message || 'Error fetching settings'
      )
    );
  }
}

function* fetchAllSettingsSaga(): Generator<any, void, any> {
  try {
    const response = yield call(settingsService.getAll);
    yield put(fetchAllSettingsSuccess(response));
  } catch (error: any) {
    yield put(
      fetchAllSettingsFailure(
        error.response?.data?.message ||
          error.message ||
          'Error fetching all settings'
      )
    );
  }
}

function* createSettingsSaga(
  action: ReturnType<typeof createSettingsRequest>
): Generator<any, void, any> {
  try {
    const payload = sanitizeSettings(action.payload);
    const response = yield call(settingsService.create, payload);

    yield put(createSettingsSuccess(response));
  } catch (error: any) {
    const isNetworkError =
      error.message === 'Network Error' || error.code === 'ERR_NETWORK';

    if (isNetworkError) {
      addToSyncQueue({
        method: 'POST',
        url: '/settings',
        data: action.payload,
      });

      yield put(createSettingsFailure('Offline Mode'));
      return;
    }

    yield put(
      createSettingsFailure(
        error.response?.data?.message ||
          error.message ||
          'Error creating settings'
      )
    );
  }
}

function* updateSettingsSaga(
  action: ReturnType<typeof updateSettingsRequest>
): Generator<any, void, any> {
  try {
    const payload = sanitizeSettings(action.payload);
    const response = yield call(settingsService.update, payload);

    yield put(updateSettingsSuccess(response));
  } catch (error: any) {
    const isNetworkError =
      error.message === 'Network Error' || error.code === 'ERR_NETWORK';

    if (isNetworkError) {
      addToSyncQueue({
        method: 'PATCH',
        url: '/settings',
        data: action.payload,
      });

      yield put(updateSettingsFailure('Offline Mode'));
      return;
    }

    yield put(
      updateSettingsFailure(
        error.response?.data?.message ||
          error.message ||
          'Error updating settings'
      )
    );
  }
}

function* deleteSettingsSaga(
  action: ReturnType<typeof deleteSettingsRequest>
): Generator<any, void, any> {
  try {
    yield call(settingsService.delete, action.payload);
    yield put(deleteSettingsSuccess());
  } catch (error: any) {
    yield put(
      deleteSettingsFailure(
        error.response?.data?.message ||
          error.message ||
          'Error deleting settings'
      )
    );
  }
}

function* adminUpdateSettingsSaga(
  action: ReturnType<typeof adminUpdateSettingsRequest>
): Generator<any, void, any> {
  try {
    const payload = sanitizeSettings(action.payload.data);
    const response = yield call(
      settingsService.adminUpdate,
      action.payload.id,
      payload
    );

    yield put(adminUpdateSettingsSuccess(response));
  } catch (error: any) {
    yield put(
      adminUpdateSettingsFailure(
        error.response?.data?.message ||
          error.message ||
          'Error updating settings'
      )
    );
  }
}

export default function* settingsSaga(): Generator {
  yield all([
    takeLatest(fetchSettingsRequest.type, fetchSettingsSaga),
    takeLatest(fetchAllSettingsRequest.type, fetchAllSettingsSaga),
    takeLatest(createSettingsRequest.type, createSettingsSaga),
    takeLatest(updateSettingsRequest.type, updateSettingsSaga),
    takeLatest(deleteSettingsRequest.type, deleteSettingsSaga),
    takeLatest(adminUpdateSettingsRequest.type, adminUpdateSettingsSaga),
  ]);
}