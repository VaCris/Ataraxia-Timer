export enum SubscriptionTier {
    GUEST = 'GUEST',
    FREE = 'FREE',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE',
}

export enum SystemRole {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
}

export interface UpdateUserInfoDto {
    username?: string;
    name?: string;
    email?: string;
    displayName?: string;
    fullName?: string;
}

export interface UpdateAvatarDto {
    avatarUrl: string;
}

export interface DeleteAccountDto {
    confirmationPassword: string;
}

export interface UserResponseDto {
    id: string;
    username?: string;
    name?: string;
    email?: string;
    fullName?: string;
    displayName?: string;
    avatarUrl?: string;
    emailVerified?: boolean;
    subscriptionTier?: SubscriptionTier;
    systemRole?: SystemRole;
    experience?: number;
    pomodorosCompleted?: number;
    currentStreak?: number;
    longestStreak?: number;
    isGuest?: boolean;
}

export interface UserProfileResponseDto {
    id: string;
    name?: string;
    fullName?: string;
    avatarUrl?: string;
    experience?: number;
    pomodorosCompleted?: number;
    longestStreak?: number;
}
