import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import timerReducer from './slices/timerSlice';
import tasksReducer from './slices/tasksSlice';
import settingsReducer from './slices/settingsSlice';

import { rootSaga } from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
    auth: authReducer,
    timer: timerReducer,
    tasks: tasksReducer,
    settings: settingsReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'auth/logout') {
        state = undefined;
    }

    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);