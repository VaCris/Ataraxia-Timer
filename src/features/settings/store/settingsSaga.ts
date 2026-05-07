import { call, put, takeLatest } from 'redux-saga/effects'
import { settingsService } from '@api/settings/settings.service'
import { addToSyncQueue } from '@api/syncManager'
import {
  fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
  fetchAllSettingsRequest, fetchAllSettingsSuccess, fetchAllSettingsFailure,
  createSettingsRequest, createSettingsSuccess, createSettingsFailure,
  updateSettingsRequest, updateSettingsSuccess, updateSettingsFailure,
  deleteSettingsRequest, deleteSettingsSuccess, deleteSettingsFailure,
  adminUpdateSettingsRequest, adminUpdateSettingsSuccess, adminUpdateSettingsFailure
} from '../../features/settings/store/settingsSlice'

const sanitizeSettings = (p: any) => ({
  focusDuration: p.focusDuration,
  shortBreakDuration: p.shortBreakDuration,
  longBreakDuration: p.longBreakDuration,
  autoStartBreaks: p.autoStartBreaks,
  autoStartPomodoros: p.autoStartPomodoros,
  longBreakInterval: p.longBreakInterval,
  theme: ['light', 'dark', 'system'].includes(p.theme) ? p.theme : 'dark',
  soundEnabled: p.soundEnabled,
  platform: p.platform || 'web'
})

function* fetchSettingsSaga(): Generator<any, void, any> {
  try {
    const r = yield call(settingsService.get)
    yield put(fetchSettingsSuccess(r))
  } catch (e: any) {
    yield put(fetchSettingsFailure(e.response?.data?.message || 'Error fetching settings'))
  }
}

function* fetchAllSettingsSaga(): Generator<any, void, any> {
  try {
    const r = yield call(settingsService.getAll)
    yield put(fetchAllSettingsSuccess(r))
  } catch (e: any) {
    yield put(fetchAllSettingsFailure(e.response?.data?.message || 'Error fetching all settings'))
  }
}

function* createSettingsSaga(a: ReturnType<typeof createSettingsRequest>): Generator<any, void, any> {
  try {
    const clean = sanitizeSettings(a.payload)
    const r = yield call(settingsService.create, clean)
    yield put(createSettingsSuccess(r))
  } catch (e: any) {
    const isNetworkError = e.message === 'Network Error' || e.code === 'ERR_NETWORK'
    if (isNetworkError) {
      addToSyncQueue({ method: 'POST', url: '/settings', data: a.payload })
      yield put(createSettingsFailure('Offline Mode'))
    } else {
      yield put(createSettingsFailure(e.response?.data?.message || 'Error creating settings'))
    }
  }
}

function* updateSettingsSaga(a: ReturnType<typeof updateSettingsRequest>): Generator<any, void, any> {
  try {
    const clean = sanitizeSettings(a.payload)
    const r = yield call(settingsService.update, clean)
    yield put(updateSettingsSuccess(r))
  } catch (e: any) {
    const isNetworkError = e.message === 'Network Error' || e.code === 'ERR_NETWORK'
    if (isNetworkError) {
      addToSyncQueue({ method: 'PATCH', url: '/settings', data: a.payload })
      yield put(updateSettingsFailure('Offline Mode'))
    } else {
      yield put(updateSettingsFailure(e.response?.data?.message || 'Error updating settings'))
    }
  }
}

function* deleteSettingsSaga(a: ReturnType<typeof deleteSettingsRequest>): Generator<any, void, any> {
  try {
    yield call(settingsService.delete, a.payload)
    yield put(deleteSettingsSuccess())
  } catch (e: any) {
    yield put(deleteSettingsFailure(e.response?.data?.message || 'Error deleting settings'))
  }
}

function* adminUpdateSettingsSaga(a: ReturnType<typeof adminUpdateSettingsRequest>): Generator<any, void, any> {
  try {
    const clean = sanitizeSettings(a.payload.data)
    const r = yield call(settingsService.adminUpdate, a.payload.id, clean)
    yield put(adminUpdateSettingsSuccess(r))
  } catch (e: any) {
    yield put(adminUpdateSettingsFailure(e.response?.data?.message || 'Error updating settings (admin)'))
  }
}

export default function* settingsSaga(): Generator {
  yield takeLatest(fetchSettingsRequest.type, fetchSettingsSaga)
  yield takeLatest(fetchAllSettingsRequest.type, fetchAllSettingsSaga)
  yield takeLatest(createSettingsRequest.type, createSettingsSaga)
  yield takeLatest(updateSettingsRequest.type, updateSettingsSaga)
  yield takeLatest(deleteSettingsRequest.type, deleteSettingsSaga)
  yield takeLatest(adminUpdateSettingsRequest.type, adminUpdateSettingsSaga)
}