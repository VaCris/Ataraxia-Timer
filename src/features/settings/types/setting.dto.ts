export interface SettingResponse {
    id: string
    userId: string

    focusDuration?: number
    shortBreakDuration?: number
    longBreakDuration?: number
    longBreakInterval?: number

    autoStartBreaks?: boolean
    autoStartPomodoros?: boolean

    theme?: string
    soundEnabled?: boolean
    platform?: string
}

export type UpdateSettingDto = Partial<SettingResponse>