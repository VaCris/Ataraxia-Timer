import api from '@api/client';

import {
    LoginDto,
    RegisterDto,
    GuestLoginDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    AuthResponse
} from '../types/auth.dto';

const ENDPOINTS = {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    REGISTER: '/auth/register',
    GUEST: '/auth/guest-login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
};

export const authService = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>(ENDPOINTS.LOGIN, data)
        return res.data
    },

    guestLogin: async (data: GuestLoginDto): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>(ENDPOINTS.GUEST, data)
        return res.data
    },

    register: async (data: RegisterDto): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>(ENDPOINTS.REGISTER, data)
        return res.data
    },

    getProfile: async (): Promise<AuthResponse> => {
        const res = await api.get<AuthResponse>(ENDPOINTS.PROFILE)
        return res.data
    },

    logout: async () => {
        await api.post(ENDPOINTS.LOGOUT)
    },

    refresh: async (): Promise<AuthResponse> => {
        const res = await api.post<AuthResponse>(ENDPOINTS.REFRESH)
        return res.data
    },

    forgotPassword: async (data: ForgotPasswordDto) => {
        await api.post(ENDPOINTS.FORGOT_PASSWORD, data)
    },

    resetPassword: async (data: ResetPasswordDto) => {
        await api.post(ENDPOINTS.RESET_PASSWORD, data)
    }
};