import axios from 'axios';
import { authService } from './auth.service';

const API_URL = (import.meta as any).env.VITE_API_URL;
let circuitOpen = false;
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const clearAuthHeader = () => {
    delete apiClient.defaults.headers.Authorization;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

apiClient.interceptors.request.use((config) => {
    if (circuitOpen) {
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort("Circuit breaker active: Server is down.");
    }

    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const data = await authService.refreshTokens(refreshToken);
                    const newToken = data.access_token;

                    localStorage.setItem('access_token', newToken);
                    if (data.refresh_token) {
                        localStorage.setItem('refresh_token', data.refresh_token);
                    }

                    processQueue(null, newToken);
                    isRefreshing = false;

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    isRefreshing = false;
                    window.dispatchEvent(new CustomEvent('auth:logout'));
                    clearAuthHeader();
                }
            } else {
                window.dispatchEvent(new CustomEvent('auth:logout'));
                clearAuthHeader();
            }
        }

        if (!error.response || error.response.status >= 500) {
            if (!circuitOpen) {
                circuitOpen = true;
                window.dispatchEvent(new CustomEvent('server:down'));
                setTimeout(() => { circuitOpen = false; }, 300000);
            }
        }
        return Promise.reject(error);
    }
);