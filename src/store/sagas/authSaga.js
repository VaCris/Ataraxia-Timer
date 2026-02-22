import { call, put, takeLatest, select, delay, all } from 'redux-saga/effects';
import { authService } from '../../api/auth.service';
import {
    loginRequest, loginSuccess, loginFailure,
    registerRequest, registerSuccess, registerFailure,
    guestLoginRequest, guestLoginSuccess, guestLoginFailure,
    forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailure,
    resetPasswordRequest, resetPasswordSuccess, resetPasswordFailure,
    logout
} from '../slices/authSlice';

const saveSession = (data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('dw-user', JSON.stringify(data.user));
    if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
    }
};

const clearSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('dw-user');
    localStorage.removeItem('user_data');

    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
            key.startsWith('offline_cache_') ||
            key.startsWith('dw-saved-playlists') ||
            key === 'timer_state'
        ) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
};

function* loginSaga(action) {
    const { email, password, resolve } = action.payload || {};
    try {
        const data = yield call(authService.login, { email, password });
        yield call(saveSession, data);
        yield put(loginSuccess(data));
        if (resolve) resolve({ success: true });
    } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        yield put(loginFailure(message));
        if (resolve) resolve({ success: false, error: message });
    }
}

function* registerSaga(action) {
    const { userData, resolve } = action.payload || {};
    try {
        const data = yield call(authService.register, userData);
        yield call(saveSession, data);
        yield put(registerSuccess(data));
        if (resolve) resolve({ success: true });
    } catch (error) {
        const message = error.response?.data?.message || "Registration failed";
        yield put(registerFailure(message));
        if (resolve) resolve({ success: false, error: message });
    }
}

function* guestLoginSaga(action) {
    const { resolve } = action.payload || {};
    try {
        const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);

        const data = yield call(authService.guestLogin, { deviceId });
        yield call(saveSession, data);
        yield put(guestLoginSuccess(data));
        if (resolve) resolve(true);
    } catch (error) {
        yield put(guestLoginFailure(error.message));
        if (resolve) resolve(false);
    }
}

function* forgotPasswordSaga(action) {
    const { email, resolve } = action.payload || {};
    try {
        yield call(authService.forgotPassword, email);
        yield put(forgotPasswordSuccess());
        if (resolve) resolve({ success: true });
    } catch (error) {
        const message = error.response?.data?.message || "Failed to send reset email";
        yield put(forgotPasswordFailure(message));
        if (resolve) resolve({ success: false, error: message });
    }
}

function* resetPasswordSaga(action) {
    const { token, password, resolve } = action.payload || {};
    try {
        yield call(authService.resetPassword, token, password);
        yield put(resetPasswordSuccess());
        if (resolve) resolve({ success: true });
    } catch (error) {
        const message = error.response?.data?.message || "Failed to reset password";
        yield put(resetPasswordFailure(message));
        if (resolve) resolve({ success: false, error: message });
    }
}

function* logoutSaga() {
    yield call(clearSession);
}

function* checkServerStatus() {
    while (true) {
        const state = yield select(state => state.auth);
        const token = state.token;

        if (navigator.onLine && token?.startsWith('offline_token_')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                yield call(fetch, `${apiUrl}/tags`, { method: 'HEAD', cache: 'no-store' });
                localStorage.removeItem('access_token');
                localStorage.removeItem('dw-user');
                localStorage.removeItem('refresh_token');

                yield put(logout());
            } catch (e) {
                yield delay(5000);
            }
        } else {
            yield delay(10000);
        }
    }
}

export function* watchAuth() {
    yield all([
        takeLatest(loginRequest.type, loginSaga),
        takeLatest(registerRequest.type, registerSaga),
        takeLatest(guestLoginRequest.type, guestLoginSaga),
        takeLatest(logout.type, logoutSaga),
        takeLatest(forgotPasswordRequest.type, forgotPasswordSaga),
        takeLatest(resetPasswordRequest.type, resetPasswordSaga),
        call(checkServerStatus),
    ]);
}