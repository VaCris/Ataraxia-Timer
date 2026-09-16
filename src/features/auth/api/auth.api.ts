import api from '@api/client';

import {
    LoginDto,
    RegisterDto,
    GuestLoginDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    ChangePasswordDto,
    VerifyEmailDto,
    ResendVerificationDto,
    AuthResponse
} from '../types/auth.dto';

const ENDPOINTS = {
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    GUEST: '/auth/guest-login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
};

export const authService = {
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const payload = {
            identifier: data.email,
            password: data.password
        };
        const res = await api.post<AuthResponse>(ENDPOINTS.LOGIN, payload)
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

    forgotPassword: async (data: ForgotPasswordDto) => {
        await api.post(ENDPOINTS.FORGOT_PASSWORD, data)
    },

    resetPassword: async (data: ResetPasswordDto) => {
        await api.post(ENDPOINTS.RESET_PASSWORD, data)
    },

    changePassword: async (data: ChangePasswordDto) => {
        await api.post(ENDPOINTS.CHANGE_PASSWORD, data)
    },

    verifyEmail: async (data: VerifyEmailDto) => {
        await api.post(ENDPOINTS.VERIFY_EMAIL, data)
    },

    resendVerification: async (data: ResendVerificationDto) => {
        await api.post(ENDPOINTS.RESEND_VERIFICATION, data)
    },
};
