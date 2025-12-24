import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialMode = 'work', customSettings) => {
    const settings = customSettings || {
        work: 25,
        short: 5,
        long: 15
    };

    const MODES = {
        work: { label: 'Deep Work', minutes: parseInt(settings.work) },
        short: { label: 'Short Break', minutes: parseInt(settings.short) },
        long: { label: 'Long Break', minutes: parseInt(settings.long) },
    };

    const [mode, setMode] = useState(initialMode);
    const [timeLeft, setTimeLeft] = useState(MODES[initialMode].minutes * 60);
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef(new Audio('/sounds/alarm.mp3'));

    useEffect(() => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    }, [mode, customSettings]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playAlarm();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const playAlarm = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = 0.5;
        audioRef.current.play().catch(e => console.log(e));
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].minutes * 60);
    };

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return {
        mode, setMode,
        timeLeft, formatTime,
        isActive, toggleTimer, resetTimer
    };
};