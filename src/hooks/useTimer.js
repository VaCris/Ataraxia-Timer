import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialMode = 'work', customSettings, autoStart = false, longBreakInterval = 4, volume = 0.5) => {
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
    const [cycles, setCycles] = useState(1);
    const audioRef = useRef(new Audio('/sounds/alarm.mp3'));

    useEffect(() => {
        setTimeLeft(MODES[mode].minutes * 60);
    }, [mode, customSettings]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Error audio:", e));
            if (autoStart) {
                handleAutoSwitch();
            } else {
                setIsActive(false);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, autoStart, longBreakInterval]);

    const handleAutoSwitch = () => {
        if (mode === 'work') {
            const currentCycle = cycles;
            if (currentCycle % longBreakInterval === 0) {
                setMode('long');
            } else {
                setMode('short');
            }
        } else {
            setMode('work');
            setCycles(c => c + 1);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMode('work');
        setCycles(1);
        setTimeLeft(MODES['work'].minutes * 60);
    };

    const formatTime = () => {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return {
        mode, setMode,
        timeLeft, formatTime,
        isActive, toggleTimer, resetTimer,
        cycles
    };
};