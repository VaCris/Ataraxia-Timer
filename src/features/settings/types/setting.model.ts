import type { SettingPlatform, SettingTheme } from './setting.dto'

export type SettingSyncStatus = 'synced' | 'pending_update'

export interface SettingModel {
  id: string
  userId: string

  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number

  autoStartBreaks: boolean
  autoStartPomodoros: boolean

  theme: SettingTheme
  soundEnabled: boolean
  platform: SettingPlatform

  syncStatus: SettingSyncStatus
  updatedAt: number
}