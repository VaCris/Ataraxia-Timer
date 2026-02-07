import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL;

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

const refreshClient = axios.create({
    baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/auth/login')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
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

            try {

                const { data } = await refreshClient.post('/auth/refresh', {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });

                const { access_token, refresh_token } = data;
                localStorage.setItem('access_token', access_token);
                if (refresh_token) localStorage.setItem('refresh_token', refresh_token);

                processQueue(null, access_token);
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                window.dispatchEvent(new CustomEvent('auth:logout'));
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);