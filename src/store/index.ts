import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import settingsReducer from '../features/settings/store/settingsSlice'
import authReducer from '../features/auth/store/authSlice'
import tasksReducer from '../features/tasks/store/tasksSlice'
import timersReducer from '@/features/pomodoro/store/timersSlice'
import timerReducer from '@/features/pomodoro/store/timerSlice'
import tagReducer from '../features/tags/store/tagsSlice'
import pomodoroReducer from '@/features/pomodoro/store/pomodoroSlice'

import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    tasks: tasksReducer,
    tags: tagReducer,
    timers: timersReducer,
    timer: timerReducer,
    pomodoro: pomodoroReducer
  },
  middleware: gDM => gDM({ thunk: false }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;