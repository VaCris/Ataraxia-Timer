import { UISettings } from '@/features/settings/types';

export const DEFAULT_SHORTCUTS: Record<string, string> = {
  settings: 's',
  support: 'h',
  music: 'm',
  games: 'g',
  stats: 't',
  achievements: 'a',
};

export const INITIAL_UI_SETTINGS: UISettings = {
  theme: 'dark',
  accentColor: '#14b8a6',
  bgImage: '/assets/default-image.png',
  blurIntensity: 0,
  volume: 50,
  isMuted: false,
  pipEnabled: true,
  is24Hour: false,
  customShortcuts: {},
};

export const SETTINGS_DEFAULTS = {
  pomodoroLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  volume: 50,
  theme: 'dark' as const,
  language: 'en',
  timeFormat: '24h' as const,
  weekStart: 'monday' as const,
  notificationsEnabled: true,
};
