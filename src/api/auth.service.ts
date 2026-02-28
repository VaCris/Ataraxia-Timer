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
            return response.data;
        } catch (error: any) {
            if (!error.response) {
                return {
                    access_token: `offline_token_${data.deviceId || Date.now()}`,
                    refresh_token: 'offline_refresh',
                    user: {
                        id: `local_${data.deviceId || Date.now()}`,
                        email: 'guest@local',
                        name: 'Guest User',
                        isGuest: true
                    }
                };
            }
            throw error;
        }
    },
    forgotPassword: async (email: string) => {
        const response = await apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
        return response.data;
    },
    resetPassword: async (token: string, newPassword: string) => {
        const response = await apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, newPassword });
        return response.data;
    }
};