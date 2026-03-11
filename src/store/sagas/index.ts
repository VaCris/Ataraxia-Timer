import { all } from 'redux-saga/effects'
import { taskSaga } from './tasksSaga'
import authSaga from './authSaga'
import settingsSaga from './settingsSaga'
import timerSaga from './timerSaga'

export default function* rootSaga() {
  yield all([
    taskSaga(),
    authSaga(),
    settingsSaga(),
    timerSaga(),
  ])
}