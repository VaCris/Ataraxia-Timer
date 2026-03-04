import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
    reducer: {
        settings: settingsReducer,
    },
});