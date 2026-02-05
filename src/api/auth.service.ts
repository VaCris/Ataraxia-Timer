import { apiClient } from './client';
import { LoginDto, RegisterDto, AuthResponse, GuestLoginDto } from '../dto/auth.types';

export const authService = {
    login: async (data: LoginDto) => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', data);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            throw new Error(message);
        }
    },

    register: async (data: RegisterDto) => {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/register', data);
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            throw new Error(message);
        }
    },

    guestLogin: async (data: GuestLoginDto) => {
        const response = await apiClient.post<AuthResponse>('/auth/guest-login', data);
        return {
            ...response.data,
            access_token: response.data.access_token
        };
    }
};