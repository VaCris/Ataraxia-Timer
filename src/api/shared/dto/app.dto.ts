export interface GetLeaderboardDto {
    limit?: number;
    offset?: number;
}

export const CreateGetLeaderboardDto = (limit = 10, offset = 0): GetLeaderboardDto => ({
    limit,
    offset
});

export interface AppSettingsDto extends UpdateSettingDto {}

export interface UpdateSettingDto {
    pomodoroLength?: number;
    shortBreakLength?: number;
    longBreakLength?: number;
    theme?: string;
    soundEnabled?: boolean;
    notificationsEnabled?: boolean;
}