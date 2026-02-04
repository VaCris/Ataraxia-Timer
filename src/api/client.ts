import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL;
let circuitOpen = false;

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    if (circuitOpen) {
        const controller = new AbortController();
        config.signal = controller.signal;
        controller.abort("Circuit breaker active: Server is down or CORS issue.");
    }

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
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