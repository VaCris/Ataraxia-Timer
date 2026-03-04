export interface UpdateSettingDto {
    pomodoroLength?: number;
    shortBreakLength?: number;
    longBreakLength?: number;
    theme?: string;
    soundEnabled?: boolean;
    notificationsEnabled?: boolean;
}

export const CreateUpdateSettingDto = (data: Partial<UpdateSettingDto>): UpdateSettingDto => {
    const dto: UpdateSettingDto = {};
    
    if (data.pomodoroLength !== undefined) dto.pomodoroLength = data.pomodoroLength;
    if (data.shortBreakLength !== undefined) dto.shortBreakLength = data.shortBreakLength;
    if (data.longBreakLength !== undefined) dto.longBreakLength = data.longBreakLength;
    if (data.theme !== undefined) dto.theme = data.theme;
    if (data.soundEnabled !== undefined) dto.soundEnabled = data.soundEnabled;
    if (data.notificationsEnabled !== undefined) dto.notificationsEnabled = data.notificationsEnabled;
    
    return dto;
};