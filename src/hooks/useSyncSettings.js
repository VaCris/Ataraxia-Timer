import { useEffect, useRef } from 'react';
import { settingsService } from '../api/settings.service';

export const useSyncSettings = (user, token, isMaintenance, setters) => {
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (!user || user.isGuest || !token || isMaintenance) return;

        const sync = async () => {
            try {
                if (isFirstLoad.current) {
                    const cloudSettings = await settingsService.getSettings();

                    if (cloudSettings) {
                        setters.setTimerSettings({
                            work: cloudSettings.focusDuration || 25,
                            short: cloudSettings.shortBreakDuration || 5,
                            long: cloudSettings.longBreakDuration || 15
                        });

                        if (cloudSettings.longBreakInterval) {
                            setters.setLongBreakInterval(cloudSettings.longBreakInterval);
                        }
                        if (cloudSettings.autoStartPomodoros !== undefined) {
                            setters.setAutoStart(cloudSettings.autoStartPomodoros);
                        }

                        if (cloudSettings.theme && cloudSettings.theme.includes('|')) {
                            const [savedColor, savedBg] = cloudSettings.theme.split('|');
                            if (savedColor) setters.setAccentColor(savedColor);
                            if (savedBg) setters.setBgImage(savedBg);
                        }
                    }
                    isFirstLoad.current = false;
                }
            } catch (error) {
                console.error("Cloud sync failed:", error);
            }
        };

        sync();
    }, [user?.id, token, setters, isMaintenance]);
};