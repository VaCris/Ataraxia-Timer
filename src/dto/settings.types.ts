export interface CreateSettingDto {
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    longBreakInterval: number;
    theme: 'light' | 'dark' | 'system';
    soundEnabled: boolean;
    platform: 'web' | 'mobile' | 'desktop';
}

export interface UpdateSettingDto extends Partial<CreateSettingDto> { }

export interface SettingResponse extends CreateSettingDto {
    id: string;
    userId: string;
}