import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import settingsReducer from './slices/settingsSlice'
import authReducer from './slices/authSlice'
import tasksReducer from './slices/tasksSlice'
import timerReducer from './slices/timerSlice'

import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    tasks: tasksReducer,
    timer: timerReducer
  },
  middleware: gDM => gDM({ thunk: false }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga)