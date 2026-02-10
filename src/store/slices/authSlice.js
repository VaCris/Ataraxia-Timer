import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('dw-user')) || null,
    loading: false,
    initialized: !!localStorage.getItem('access_token') && !localStorage.getItem('access_token').startsWith('offline_token_'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateAuth: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.initialized = action.payload.token ? !action.payload.token.startsWith('offline_token_') : false;
        },
        clearAuth: (state) => {
            state.token = null;
            state.user = null;
            state.initialized = false;
        }
    },
});

export const { updateAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;