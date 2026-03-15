import { all } from 'redux-saga/effects'
import { taskSaga } from './tasksSaga'
import tagSaga from './tagSaga'
import authSaga from './authSaga'
import settingsSaga from './settingsSaga'
import timerSaga from './timerSaga'

export default function* rootSaga() {
  yield all([
    taskSaga(),
    tagSaga(),
    authSaga(),
    settingsSaga(),
    timerSaga(),
  ])
}