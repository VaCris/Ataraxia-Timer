export interface SettingModel {
    id: string
    userId: string
  
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    longBreakInterval: number
  
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
  
    theme: string
    soundEnabled: boolean
    platform: string
  
    syncStatus: 'synced' | 'pending_update'
    updatedAt: number
  }