export const buildSettingsPayload = (settings) => ({
    focusDuration: Number(settings.focusDuration),
    shortBreakDuration: Number(settings.shortBreakDuration),
    longBreakDuration: Number(settings.longBreakDuration),
    longBreakInterval: Number(settings.longBreakInterval),
    autoStartPomodoros: Boolean(settings.autoStartPomodoros),
});
