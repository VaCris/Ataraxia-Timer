import { call, put, takeLatest } from 'redux-saga/effects'
import { settingsService } from '@api/settings/settings.service'
import {
  fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
  fetchAllSettingsRequest, fetchAllSettingsSuccess, fetchAllSettingsFailure,
  createSettingsRequest, createSettingsSuccess, createSettingsFailure,
  updateSettingsRequest, updateSettingsSuccess, updateSettingsFailure,
  deleteSettingsRequest, deleteSettingsSuccess, deleteSettingsFailure,
  adminUpdateSettingsRequest, adminUpdateSettingsSuccess, adminUpdateSettingsFailure
} from '../slices/settingsSlice'

function* fetchSettingsSaga(): Generator<any, void, any> {
  try {
    const r: any = yield call(settingsService.get)
    yield put(fetchSettingsSuccess(r))
  } catch (e: any) {
    yield put(fetchSettingsFailure(e.response?.data?.message || 'Error fetching settings'))
  }
}

function* fetchAllSettingsSaga(): Generator<any, void, any> {
  try {
    const r: any = yield call(settingsService.getAll)
    yield put(fetchAllSettingsSuccess(r))
  } catch (e: any) {
    yield put(fetchAllSettingsFailure(e.response?.data?.message || 'Error fetching all settings'))
  }
}

function* createSettingsSaga(a: ReturnType<typeof createSettingsRequest>): Generator<any, void, any> {
  try {
    const r: any = yield call(settingsService.create, a.payload)
    yield put(createSettingsSuccess(r))
  } catch (e: any) {
    yield put(createSettingsFailure(e.response?.data?.message || 'Error creating settings'))
  }
}

function* updateSettingsSaga(a: ReturnType<typeof updateSettingsRequest>): Generator<any, void, any> {
  try {
    const r: any = yield call(settingsService.update, a.payload)
    yield put(updateSettingsSuccess(r))
  } catch (e: any) {
    yield put(updateSettingsFailure(e.response?.data?.message || 'Error updating settings'))
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
    const r: any = yield call(settingsService.adminUpdate, a.payload.id, a.payload.data)
    yield put(adminUpdateSettingsSuccess(r))
  } catch (e: any) {
    yield put(adminUpdateSettingsFailure(e.response?.data?.message || 'Error updating settings (admin)'))
  }
}

export default function* settingsSaga() {
  yield takeLatest(fetchSettingsRequest.type, fetchSettingsSaga)
  yield takeLatest(fetchAllSettingsRequest.type, fetchAllSettingsSaga)
  yield takeLatest(createSettingsRequest.type, createSettingsSaga)
  yield takeLatest(updateSettingsRequest.type, updateSettingsSaga)
  yield takeLatest(deleteSettingsRequest.type, deleteSettingsSaga)
  yield takeLatest(adminUpdateSettingsRequest.type, adminUpdateSettingsSaga)
}