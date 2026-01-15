import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequestUrl = error.config?.url || '';

        const isAuthRequest = originalRequestUrl.includes('/auth/login') ||
            originalRequestUrl.includes('/auth/register') ||
            originalRequestUrl.includes('/auth/guest-login');

        if (error.response && error.response.status === 401 && !isAuthRequest) {
            window.dispatchEvent(new Event('auth:logout'));
        }

        return Promise.reject(error);
    }
);