import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL;
let isServerDown = false;
let abortController = new AbortController();

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    if (isServerDown) {
        config.signal = abortController.signal;
        abortController.abort();
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        isServerDown = false;
        return response;
    },
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const connectionFailed = !error.response || (status !== undefined && status >= 500);

            if (connectionFailed && !isServerDown) {
                isServerDown = true;
                abortController.abort();
                window.dispatchEvent(new CustomEvent('server:down'));

                setTimeout(() => {
                    isServerDown = false;
                    abortController = new AbortController();
                }, 60000);
            }
        }
        return Promise.reject(error);
    }
);