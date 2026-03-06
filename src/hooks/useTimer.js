import { useEffect } from 'react';
import { usePomodoro } from '@context/PomodoroContext';
import { timersService } from '@api/timers/timers.service';

export const useTimer = (refreshStats) => {
    const { state, dispatch } = usePomodoro();

    useEffect(() => {
        const syncSessionWithApi = async () => {
            if (state.timeLeft === 0 && !state.isActive) {
                try {
                    const dto = {
                        mode: state.mode.toLowerCase(),
                        duration: state.initialTime / 60,
                        taskId: state.currentTaskId || null
                    };
                    await timersService.create(dto);
                    if (refreshStats) refreshStats();
                    dispatch({ 
                        type: 'SHOW_TOAST', 
                        payload: `Session saved! +${state.mode === 'FOCUS' ? '25' : '5'} XP` 
                    });
                } catch (error) {
                    console.error("Error sync session:", error);
                }
            }
        };
        syncSessionWithApi();
    }, [state.timeLeft, state.isActive]);

    return { state, dispatch };
};