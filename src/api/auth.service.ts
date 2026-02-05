import { apiClient } from './client';
import { LoginDto, RegisterDto, AuthResponse, GuestLoginDto } from '../dto/auth.types';

export const authService = {
    login: async (data: LoginDto) => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterDto) => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    guestLogin: async (data: GuestLoginDto) => {
        const response = await apiClient.post<AuthResponse>('/auth/guest-login', data);
        return response.data;
    }
};