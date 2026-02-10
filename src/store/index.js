import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import timerReducer from './slices/timerSlice';
import tasksReducer from './slices/tasksSlice';
import settingsReducer from './slices/settingsSlice';

import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        timer: timerReducer,
        tasks: tasksReducer,
        settings: settingsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);