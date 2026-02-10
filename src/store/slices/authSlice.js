import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('dw-user')) || null,
    loading: false,
    error: null,
    initialized: !!localStorage.getItem('access_token') && !localStorage.getItem('access_token').startsWith('offline_token_'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        //Login
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.initialized = !action.payload.access_token.startsWith('offline_token_');
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Register
        registerRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.initialized = true;
            state.error = null;
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Guest Login
        guestLoginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        guestLoginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.access_token;
            state.initialized = !action.payload.access_token.startsWith('offline_token_');
            state.error = null;
        },
        guestLoginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        // Logout & Clear
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.initialized = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },

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

export const {
    loginRequest, loginSuccess, loginFailure,
    registerRequest, registerSuccess, registerFailure,
    guestLoginRequest, guestLoginSuccess, guestLoginFailure,
    logout, clearError, updateAuth, clearAuth
} = authSlice.actions;
export default authSlice.reducer;