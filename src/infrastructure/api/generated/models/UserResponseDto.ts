/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserResponseDto = {
    id?: string;
    username?: string;
    name?: string;
    email?: string;
    fullName?: string;
    displayName?: string;
    avatarUrl?: string;
    emailVerified?: boolean;
    subscriptionTier?: UserResponseDto.subscriptionTier;
    systemRole?: UserResponseDto.systemRole;
    experience?: number;
    pomodorosCompleted?: number;
    currentStreak?: number;
    longestStreak?: number;
    isGuest?: boolean;
};
export namespace UserResponseDto {
    export enum subscriptionTier {
        GUEST = 'GUEST',
        FREE = 'FREE',
        PRO = 'PRO',
        ENTERPRISE = 'ENTERPRISE',
    }
    export enum systemRole {
        ROLE_USER = 'ROLE_USER',
        ROLE_ADMIN = 'ROLE_ADMIN',
    }
}

