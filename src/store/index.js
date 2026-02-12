import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import timerReducer from './slices/timerSlice';
import tasksReducer from './slices/tasksSlice';
import musicReducer from './slices/musicSlice';
import settingsReducer from './slices/settingsSlice';
import achievementsReducer from './slices/achievementsSlice';
import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        auth: authReducer,
        timer: timerReducer,
        tasks: tasksReducer,
        settings: settingsReducer,
        music: musicReducer,
        achievements: achievementsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);