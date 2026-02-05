import { useEffect } from 'react';
import { settingsService } from '../api/settings.service';
import { tagsService } from '../api/tags.service';

export const useSyncSettings = (user, token, isMaintenance, setters) => {
    const { setTimerSettings, setLongBreakInterval, setAutoStart, setAccentColor } = setters;

    useEffect(() => {
        if (!token || !user || user.isGuest || isMaintenance) return;

        const syncSettings = async () => {
            try {
                const [settingsRes, tagsRes] = await Promise.allSettled([
                    settingsService.getSettings(),
                    tagsService.getAll()
                ]);


                if (settingsRes.status === 'fulfilled' && settingsRes.value) {
                    const cloud = settingsRes.value;
                    setTimerSettings(prev => ({
                        ...prev,
                        work: cloud.focusDuration || prev.work,
                        short: cloud.shortBreakDuration || prev.short,
                        long: cloud.longBreakDuration || prev.long
                    }));

                    if (cloud.longBreakInterval) setLongBreakInterval(cloud.longBreakInterval);

                    const localAutoStart = localStorage.getItem('dw-autostart');
                    if (cloud.autoStartPomodoros !== undefined && localAutoStart === null) {
                        setAutoStart(cloud.autoStartPomodoros);
                    }
                }

                if (tagsRes.status === 'fulfilled' && tagsRes.value) {
                    const focusTag = tagsRes.value.find(tag => tag.name === 'Focus');
                    if (focusTag?.color) setAccentColor(focusTag.color);
                }

            } catch (err) {
                console.warn("Cloud sync partial failure:", err.message);
            }
        };

        syncSettings();
    }, [user, token, isMaintenance, setTimerSettings, setLongBreakInterval, setAutoStart, setAccentColor]);
};