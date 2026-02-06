export const buildSettingsPayload = (timerSettings, autoStart, longBreakInterval, accentColor, volume) => {
    const combinedTheme = `${accentColor}|${background || ''}`;
    return {
        timerSettings: {
            work: Math.max(1, Math.min(timerSettings.work || 25, 120)),
            short: Math.max(1, timerSettings.short || 5),
            long: Math.max(1, timerSettings.long || 15)
        },
        autoStart: Boolean(autoStart),
        longBreakInterval: Math.max(1, Math.min(longBreakInterval || 4, 10)),
        theme: combinedTheme,
        volume: Math.max(0, Math.min(volume || 0.5, 1))
    };
};