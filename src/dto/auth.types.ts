export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    firstname: string;
    lastname?: string;
    email: string;
    password: string;
    deviceId?: string;
}

export interface GuestLoginDto {
    deviceId: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName?: string;
        isGuest?: boolean;
    };
}