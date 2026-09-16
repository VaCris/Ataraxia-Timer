export interface RegisterDto {
    username: string;
    email: string;
    password: string;
    deviceId?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface GuestLoginDto {
    deviceId: string;
    username?: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface VerifyEmailDto {
    token: string;
}

export interface ResendVerificationDto {
    email: string;
}

export interface AuthUser {
    id: string;
    email?: string;
    name: string;
    isGuest: boolean;
    deviceId?: string;
    avatarUrl?: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: AuthUser;
}
