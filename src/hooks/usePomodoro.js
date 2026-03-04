import { useState, useEffect } from 'react';
import { timersService } from '@api/timers/timers.service';
import { CreateTimerDto } from '@api/timers/dto/timer.dto';
import toast from 'react-hot-toast';

export const usePomodoro = (initialMinutes = 25) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let timer = null;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            handleFinished();
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const handleFinished = async () => {
        setIsActive(false);
        try {
            const dto = CreateTimerDto('work', initialMinutes);
            await timersService.create(dto);
            toast.success("Session completed! XP earned");
        } catch (error) {
            toast.error("The session could not be saved");
        }
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => { setIsActive(false); setTimeLeft(initialMinutes * 60); };

    return { timeLeft, isActive, toggleTimer, resetTimer };
};