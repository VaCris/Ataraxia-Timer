import { call, put, takeLatest, select, delay, all } from 'redux-saga/effects';
import { authService } from '../../api/auth.service';
import {
    loginRequest, loginSuccess, loginFailure,
    guestLoginRequest, guestLoginSuccess, guestLoginFailure,
    logout
} from '../slices/authSlice';

const saveSession = (data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('dw-user', JSON.stringify(data.user));
    localStorage.removeItem('user_data');
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
};

const clearSession = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('dw-user');
    localStorage.removeItem('user_data');
};

function* loginSaga(action) {
    const { email, password, resolve } = action.payload;
    try {
        const data = yield call(authService.login, { email, password });
        yield call(saveSession, data);
        yield put(loginSuccess(data));
        if (resolve) yield call(resolve, { success: true });
    } catch (error) {
        const message = error.response?.data?.message || "Login failed";
        yield put(loginFailure(message));
        if (resolve) yield call(resolve, { success: false, error: message });
    }
}

function* guestLoginSaga(action) {
    const { resolve } = action.payload;
    try {
        const deviceId = localStorage.getItem('device_id') || crypto.randomUUID();
        localStorage.setItem('device_id', deviceId);
        const data = yield call(authService.guestLogin, { deviceId });
        yield call(saveSession, data);
        yield put(guestLoginSuccess(data));
        if (resolve) yield call(resolve, { success: true });
    } catch (error) {
        yield put(guestLoginFailure(error.message));
        if (resolve) yield call(resolve, { success: false, error: error.message });
    }
}

function* checkServerStatus() {
    while (true) {
        const token = yield select(state => state.auth.token);
        if (navigator.onLine && token?.startsWith('offline_token_')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                yield call(fetch, `${apiUrl}/auth/login`, { method: 'HEAD' });
                yield put(logout());
            } catch (e) { yield delay(10000); }
        } else { yield delay(15000); }
    }
}

export function* watchAuth() {
    yield all([
        takeLatest(loginRequest.type, loginSaga),
        takeLatest(guestLoginRequest.type, guestLoginSaga),
        takeLatest(logout.type, function* () { yield call(clearSession); }),
        call(checkServerStatus)
    ]);
}