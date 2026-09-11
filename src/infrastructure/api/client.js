import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.warn('VITE_API_URL is not defined');
}

const api = rateLimit(axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
}), { maxRequests: 10, perMilliseconds: 1000, maxRPS: 10 });

let refreshPromise = null;

function clearRemoteTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
}

async function tryRefresh() {
    if (refreshPromise) return refreshPromise;
    if (!navigator.onLine) return false;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    refreshPromise = (async () => {
        try {
            const { data } = await axios.post(
                `${api.defaults.baseURL}/auth/refresh`,
                { refreshToken },
                { withCredentials: true }
            );

            if (!data?.access_token) return false;

            localStorage.setItem('token', data.access_token);
            if (data.refresh_token) localStorage.setItem('refreshToken', data.refresh_token);
            return true;
        } catch {
            clearRemoteTokens();
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

api.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('token');

        if (
            navigator.onLine &&
            token &&
            isTokenExpiringSoon(token) &&
            !config.url?.includes('/auth/refresh')
        ) {
            await tryRefresh();
            token = localStorage.getItem('token');
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const status = error.response?.status;

        if (
            status === 401 &&
            navigator.onLine &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            const refreshed = await tryRefresh();
            if (refreshed) {
                const newToken = localStorage.getItem('token');
                if (newToken) originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }

            window.dispatchEvent(new CustomEvent('ataraxia:remote-session-expired'));
        }

        return Promise.reject(error);
    }
);

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
}

function isTokenExpiringSoon(token, marginMs = 60_000) {
    const payload = parseJwt(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000 - marginMs;
}

let lastRefreshTime = 0;
const REFRESH_COOLDOWN_MS = 60 * 60 * 1000;

if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible' || !navigator.onLine) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        const payload = parseJwt(token);
        if (!payload?.exp) return;

        const expiresInMs = payload.exp * 1000 - Date.now();
        const fiveMinutesMs = 5 * 60 * 1000;
        const now = Date.now();

        if (expiresInMs < fiveMinutesMs && now - lastRefreshTime > REFRESH_COOLDOWN_MS) {
            lastRefreshTime = now;
            tryRefresh();
        }
    });
}

export { tryRefresh };
export default api;
