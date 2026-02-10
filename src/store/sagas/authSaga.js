import { call, put, delay, select, takeLatest } from 'redux-saga/effects';
import { clearAuth } from '../slices/authSlice';

function* checkServerStatus() {
    while (true) {
        const state = yield select();
        const token = state.auth.token;

        if (navigator.onLine && token?.startsWith('offline_token_')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                yield call(fetch, `${apiUrl}/tags`, { method: 'HEAD', cache: 'no-store' });

                localStorage.removeItem('access_token');
                localStorage.removeItem('dw-user');
                localStorage.removeItem('refresh_token');

                yield put(clearAuth());
            } catch (e) {
                yield delay(5000);
            }
        } else {
            yield delay(10000);
        }
    }
}

export function* watchAuth() {
    yield call(checkServerStatus);
}