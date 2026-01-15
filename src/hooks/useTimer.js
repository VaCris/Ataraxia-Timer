import { useState, useEffect, useRef } from 'react';
import { timersService } from '../api/timers.service';
import { getSecondsFromSettings } from '../utils/timer.utils';

export const useTimer = (initialMode = 'work', settings, autoStart, longBreakInterval, volume) => {
    const [mode, setMode] = useState(initialMode);
    const [timeLeft, setTimeLeft] = useState(() =>
        getSecondsFromSettings(settings, initialMode)
    );
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);

    const audioRef = useRef(new Audio('/sounds/alarm.mp3'));

    useEffect(() => {
        setTimeLeft(getSecondsFromSettings(settings, mode));
    }, [mode, settings]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTimerComplete = async () => {
        audioRef.current.play().catch(e => console.log('Audio error:', e));
        setIsActive(false);

        if (mode === 'work') {
            try {
                await timersService.saveSession({
                    duration: settings.work * 60,
                    tag: null,
                    status: 'completed',
                    startTime: new Date(Date.now() - settings.work * 60 * 1000).toISOString(),
                    endTime: new Date().toISOString()
                });
                console.log("Session saved to cloud");
            } catch (error) {
                console.error(error);
            }

            const newCycles = cycles + 1;
            setCycles(newCycles);

            if (newCycles % longBreakInterval === 0) {
                switchMode('long');
            } else {
                switchMode('short');
            }
        } else {
            switchMode('work');
        }

        if (autoStart) {
            setIsActive(true);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setTimeLeft(getSecondsFromSettings(settings, newMode));
        setIsActive(false);
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(getSecondsFromSettings(settings, mode));
    };

    const formatTime = (time) => {
        if (typeof time !== 'number' || isNaN(time)) return '00:00';

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // console.log(settings);
    // console.log(mode);
    // console.log(settings?.[mode]);

    return {
        mode,
        setMode: switchMode,
        timeLeft,
        formatTime,
        isActive,
        toggleTimer,
        resetTimer,
        cycles
    };
};