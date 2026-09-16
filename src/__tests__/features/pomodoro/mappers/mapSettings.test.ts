import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mapSettings } from '@/features/pomodoro/mappers/mapSettings';
import { SettingResponseDto } from '@/features/settings/types/setting.dto';

describe('mapSettings mapper', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should map settings with default values when DTO is null or undefined', () => {
    const settings = mapSettings(null);
    expect(settings).toEqual({
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      longBreakInterval: 4,
    });
  });

  it('should map settings correctly from a valid DTO', () => {
    const dto: SettingResponseDto = {
      id: 'settings-123',
      pomodoroLength: 30,
      shortBreakLength: 10,
      longBreakLength: 20,
      autoStartBreaks: true,
      autoStartPomodoros: true,
      longBreakInterval: 5,
      soundEnabled: true,
      volume: 80,
      theme: 'dark',
      language: 'en',
      timeFormat: '24h',
      weekStart: 'monday',
      notificationsEnabled: true,
    };

    const settings = mapSettings(dto);
    expect(settings).toEqual({
      pomodoroLength: 30,
      shortBreakLength: 10,
      longBreakLength: 20,
      autoStartBreaks: true,
      autoStartPomodoros: true,
      longBreakInterval: 5,
    });
  });

  it('should handle legacy or alternative DTO properties (e.g. focusDuration)', () => {
    const dto = {
      id: 'settings-legacy',
      focusDuration: 45,
      shortBreakDuration: 8,
      longBreakDuration: 22,
      longBreakInterval: 6,
    } as any;

    const settings = mapSettings(dto);
    expect(settings.pomodoroLength).toBe(45);
    expect(settings.shortBreakLength).toBe(8);
    expect(settings.longBreakLength).toBe(22);
  });

  it('should prioritize values from localStorage over DTO values', () => {
    localStorage.setItem('ataraxia_pomodoroLength', '50');
    localStorage.setItem('ataraxia_shortBreakLength', '15');
    localStorage.setItem('ataraxia_longBreakLength', '25');
    localStorage.setItem('ataraxia_autoStartBreaks', 'true');
    localStorage.setItem('ataraxia_autoStartPomodoros', 'true');
    localStorage.setItem('ataraxia_longBreakInterval', '8');

    const dto: SettingResponseDto = {
      id: 'settings-123',
      pomodoroLength: 30,
      shortBreakLength: 10,
      longBreakLength: 20,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      longBreakInterval: 5,
      soundEnabled: true,
      volume: 80,
      theme: 'dark',
      language: 'en',
      timeFormat: '24h',
      weekStart: 'monday',
      notificationsEnabled: true,
    };

    const settings = mapSettings(dto);
    expect(settings).toEqual({
      pomodoroLength: 50,
      shortBreakLength: 15,
      longBreakLength: 25,
      autoStartBreaks: true,
      autoStartPomodoros: true,
      longBreakInterval: 8,
    });
  });

  it('should fall back to DTO values if localStorage has invalid/non-numeric values', () => {
    localStorage.setItem('ataraxia_pomodoroLength', 'not-a-number');
    localStorage.setItem('ataraxia_longBreakInterval', 'invalid-num');

    const dto = {
      pomodoroLength: 35,
      longBreakInterval: 3,
    } as any;

    const settings = mapSettings(dto);
    expect(settings.pomodoroLength).toBe(35);
    expect(settings.longBreakInterval).toBe(3);
  });
});
