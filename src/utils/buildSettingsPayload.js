export const buildSettingsPayload = (timerSettings, autoStart, longBreakInterval, volume) => {
    return {
        focusDuration: Number(timerSettings.work),
        shortBreakDuration: Number(timerSettings.short),
        longBreakDuration: Number(timerSettings.long),
        longBreakInterval: Number(longBreakInterval),
        autoStartPomodoros: Boolean(autoStart),
        theme: "dark",
        soundEnabled: volume > 0,
        platform: "web"
    };
};