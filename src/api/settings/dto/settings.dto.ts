export interface SettingDto {
    focusDuration?: number
    shortBreakDuration?: number
    longBreakDuration?: number
    autoStartBreaks?: boolean
    autoStartPomodoros?: boolean
    longBreakInterval?: number
    theme?: string
    soundEnabled?: boolean
    platform?: string
}

export interface CreateSettingDto extends SettingDto {}

export interface UpdateSettingDto extends Partial<SettingDto> { }

export interface SettingResponse extends SettingDto {
    id: string;
    userId: string;
}