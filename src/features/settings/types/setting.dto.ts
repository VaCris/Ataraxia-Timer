export type SettingTheme = 'light' | 'dark' | 'system'
export type SettingTimeFormat = '12h' | '24h'
export type SettingWeekStart = 'monday' | 'sunday'

export interface SettingRequestDto {
    pomodoroLength?: number
    shortBreakLength?: number
    longBreakLength?: number
    longBreakInterval?: number

    autoStartBreaks?: boolean
    autoStartPomodoros?: boolean

    soundEnabled?: boolean
    volume?: number
    theme?: SettingTheme
    language?: string
    timeFormat?: SettingTimeFormat
    weekStart?: SettingWeekStart
    notificationsEnabled?: boolean
}

export interface SettingResponseDto {
    id: string
    pomodoroLength: number
    shortBreakLength: number
    longBreakLength: number
    longBreakInterval: number

    autoStartBreaks: boolean
    autoStartPomodoros: boolean

    soundEnabled: boolean
    volume: number
    theme: SettingTheme
    language: string
    timeFormat: SettingTimeFormat
    weekStart: SettingWeekStart
    notificationsEnabled: boolean
}

export type CreateSettingDto = SettingRequestDto
export type UpdateSettingDto = Partial<SettingRequestDto>
