import api from '@api/Client';

import {
    CreateLoginDto,
    CreateRegisterDto,
    CreateGuestLoginDto,
    CreateForgotPasswordDto,
    CreateResetPasswordDto
} from './dto/auth.dto';

export const authService = {
    login: async (email, password) => {
        const dto = CreateLoginDto(email, password);
        const { data } = await api.post('/auth/login', dto);
        return data;
    },

    guestLogin: async (deviceId) => {
        const dto = CreateGuestLoginDto(deviceId);
        const { data } = await api.post('/auth/guest-login', dto);
        return data;
    },

    register: async (username, email, password, deviceId) => {
        const dto = CreateRegisterDto(username, email, password, deviceId);
        const { data } = await api.post('/auth/register', dto);
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get('/auth/profile');
        return data;
    },

    logout: async () => {
        const { data } = await api.post('/auth/logout');
        return data;
    },

    refresh: async () => {
        const { data } = await api.post('/auth/refresh');
        return data;
    },

    forgotPassword: async (email) => {
        const dto = CreateForgotPasswordDto(email);
        const { data } = await api.post('/auth/forgot-password', dto);
        return data;
    },

    resetPassword: async (token, newPassword) => {
        const dto = CreateResetPasswordDto(token, newPassword);
        const { data } = await api.post('/auth/reset-password', dto);
        return data;
    }
};