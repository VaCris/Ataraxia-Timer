import { all } from 'redux-saga/effects'

import authSaga from '@/features/auth/store/authSaga'
import settingsSaga from '@/features/settings/store/settingsSaga'
import { taskSaga } from '@/features/tasks/store/tasksSaga'
import tagSaga from '@/features/tags/store/tagsSaga'
import timerSaga from '@/features/pomodoro/store/timerSaga'

export default function* rootSaga() {
    yield all([
        authSaga(),
        settingsSaga(),
        taskSaga(),
        tagSaga(),
        timerSaga(),
    ])
}