import { apiClient } from './client';
import { LoginDto, RegisterDto, AuthResponse, GuestLoginDto } from '../dto/auth.types';

const ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GUEST: '/auth/guest-login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
};

export const authService = {
    login: async (data: LoginDto) => {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.LOGIN, data);
        return response.data;
    },
    register: async (data: RegisterDto) => {
        const response = await apiClient.post<AuthResponse>(ENDPOINTS.REGISTER, data);
        return response.data;
    },
    guestLogin: async (data: GuestLoginDto): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>(ENDPOINTS.GUEST, data);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
            localStorage.setItem('access_token', response.data.access_token);

            return response.data;
        } catch (error: any) {
            if (!error.response) {
                console.warn("Modo Offline: Generando sesión temporal.");

                const fallbackResponse: AuthResponse = {
                    access_token: `offline_token_${data.deviceId || 'new_user'}`,
                    refresh_token: 'offline_refresh',
                    user: {
                        id: `local_${data.deviceId || Date.now()}`,
                        email: 'guest@local',
                        name: 'Guest User',
                        isGuest: true
                    }
                };

                localStorage.setItem('access_token', fallbackResponse.access_token);

                return fallbackResponse;
            }
            throw error;
        }
    }
};