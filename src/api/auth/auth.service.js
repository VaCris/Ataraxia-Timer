import api from '@api/client';

import {
    CreateLoginDto,
    CreateRegisterDto,
    CreateGuestLoginDto,
    CreateForgotPasswordDto,
    CreateResetPasswordDto
} from './dto/auth.dto';

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
    login: async (email, password) => {
        const dto = CreateLoginDto(email, password);
        const { data } = await api.post(ENDPOINTS.LOGIN, dto);
        return data;
    },

    guestLogin: async (deviceId) => {
        const dto = CreateGuestLoginDto(deviceId);
        const { data } = await api.post(ENDPOINTS.GUEST, dto);
        return data;
    },

    register: async (username, email, password, deviceId) => {
        const dto = CreateRegisterDto(username, email, password, deviceId);
        const { data } = await api.post(ENDPOINTS.REGISTER, dto);
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get(ENDPOINTS.PROFILE);
        return data;
    },

    logout: async () => {
        const { data } = await api.post(ENDPOINTS.LOGOUT);
        return data;
    },

    refresh: async () => {
        const { data } = await api.post(ENDPOINTS.REFRESH);
        return data;
    },

    forgotPassword: async (email) => {
        const dto = CreateForgotPasswordDto(email);
        const { data } = await api.post(ENDPOINTS.FORGOT_PASSWORD, dto);
        return data;
    },

    resetPassword: async (token, newPassword) => {
        const dto = CreateResetPasswordDto(token, newPassword);
        const { data } = await api.post(ENDPOINTS.RESET_PASSWORD, dto);
        return data;
    }
};