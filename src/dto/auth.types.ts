export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    usernaame: string;
    email: string;
    password: string;
    deviceId?: string;
}
export interface GuestLoginDto {
    deviceId: string;
}
export interface ForgotPasswordDto {
    email: string;
}
export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    isGuest: boolean;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: AuthUser;
}