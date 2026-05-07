import axios from 'axios';
import { addToSyncQueue } from '../sync/syncManager';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            if (['post', 'put', 'patch', 'delete'].includes(originalRequest.method)) {
                if (!originalRequest.url.includes('/auth/')) {
                    addToSyncQueue({
                        method: originalRequest.method,
                        url: originalRequest.url,
                        data: originalRequest.data ? JSON.parse(originalRequest.data) : null,
                    });
                    
                    return Promise.resolve({ data: { success: true, offline: true } });
                }
            }
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    });

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