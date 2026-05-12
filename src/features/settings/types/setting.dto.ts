export type SettingTheme = 'light' | 'dark' | 'system'
export type SettingPlatform = 'web' | 'mobile' | 'desktop'

export interface SettingDto {
    focusDuration?: number
    shortBreakDuration?: number
    longBreakDuration?: number
    longBreakInterval?: number

    autoStartBreaks?: boolean
    autoStartPomodoros?: boolean

    theme?: SettingTheme
    soundEnabled?: boolean
    platform?: SettingPlatform
}

export interface SettingResponse extends SettingDto {
    id: string
    userId: string
}

export type CreateSettingDto = SettingDto
export type UpdateSettingDto = Partial<SettingDto>