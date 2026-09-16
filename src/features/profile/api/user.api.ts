import api from '@api/client';
import type {
    UpdateUserInfoDto,
    UpdateAvatarDto,
    DeleteAccountDto,
    UserResponseDto,
    UserProfileResponseDto,
} from '../types/user.dto';

const ENDPOINTS = {
    ME: '/users/me',
    INFO: '/users/me/info',
    AVATAR: '/users/me/avatar',
    PUBLIC_PROFILE: (id: string) => `/users/profile/${id}`,
    ADMIN_PURGE: '/users/admin/purge',
};

export const userService = {
    getMe: async (): Promise<UserResponseDto> => {
        const { data } = await api.get<UserResponseDto>(ENDPOINTS.ME);
        return data;
    },

    updateInfo: async (payload: UpdateUserInfoDto): Promise<UserResponseDto> => {
        const { data } = await api.patch<UserResponseDto>(ENDPOINTS.INFO, payload);
        return data;
    },

    updateAvatar: async (payload: UpdateAvatarDto): Promise<UserResponseDto> => {
        const { data } = await api.patch<UserResponseDto>(ENDPOINTS.AVATAR, payload);
        return data;
    },

    deleteAccount: async (payload: DeleteAccountDto): Promise<void> => {
        await api.delete(ENDPOINTS.ME, { data: payload });
    },

    getPublicProfile: async (id: string): Promise<UserProfileResponseDto> => {
        const { data } = await api.get<UserProfileResponseDto>(ENDPOINTS.PUBLIC_PROFILE(id));
        return data;
    },
};
