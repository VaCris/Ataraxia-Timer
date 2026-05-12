import axios from 'axios';
import { addToSyncQueue } from '../sync/syncManager';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.warn('VITE_API_URL is not defined');
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const isNetworkError = (error) =>
    error.message === 'Network Error' || error.code === 'ERR_NETWORK';

const isMutationMethod = (method) =>
    ['post', 'put', 'patch', 'delete'].includes(method?.toLowerCase());

const isAuthUrl = (url = '') => url.includes('/auth/');

const parseRequestData = (data) => {
    if (!data) return null;

    if (typeof data === 'object') {
        return data;
    }

    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
};

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

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

        if (!originalRequest) {
            return Promise.reject(error);
        }

        if (
            isNetworkError(error) &&
            isMutationMethod(originalRequest.method) &&
            !isAuthUrl(originalRequest.url)
        ) {
            addToSyncQueue({
                method: originalRequest.method.toUpperCase(),
                url: originalRequest.url,
                data: parseRequestData(originalRequest.data),
            });

            return Promise.resolve({
                data: {
                    success: true,
                    offline: true,
                },
            });
        }

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${api.defaults.baseURL}/auth/refresh`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${refreshToken}`,
                            },
                        }
                    );

                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('refreshToken', data.refresh_token);

                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');

                    window.location.reload();

                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;