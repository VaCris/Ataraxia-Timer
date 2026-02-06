export const buildSettingsPayload = (timerSettings, autoStart, interval, color, volume) => ({
    focusDuration: Math.max(1, Number(timerSettings.work) || 25),
    shortBreakDuration: Math.max(1, Number(timerSettings.short) || 5),
    longBreakDuration: Math.max(1, Number(timerSettings.long) || 15),
    autoStartBreaks: Boolean(autoStart),
    autoStartPomodoros: Boolean(autoStart),
    longBreakInterval: Math.max(1, Number(interval) || 4),
    theme: 'dark',
    soundEnabled: volume > 0,
    platform: 'web'
});