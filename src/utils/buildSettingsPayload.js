export const buildSettingsPayload = (timerSettings, autoStart, longBreakInterval, accentColor, volume, background) => ({
    focusDuration: Number(timerSettings.work),
    shortBreakDuration: Number(timerSettings.short),
    longBreakDuration: Number(timerSettings.long),
    longBreakInterval: Number(longBreakInterval),
    autoStartPomodoros: Boolean(autoStart),
    theme: `${accentColor}|${background || ''}`,
    soundEnabled: volume > 0,
    platform: "web"
});