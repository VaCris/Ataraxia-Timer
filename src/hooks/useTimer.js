import { useEffect } from 'react';
import { usePomodoro } from '@context/PomodoroContext';
import { timersService } from '@api/timers/timers.service';

export const useTimer = (refreshStats) => {
    const { state, dispatch } = usePomodoro();

    useEffect(() => {
        if (state.timeLeft !== 0 || state.isActive) return

        const sync = async () => {
            try {
                const dto = {
                    duration: state.initialTime,
                    taskId: state.currentTaskId ?? undefined
                }

                await timersService.create(dto)

                refreshStats?.()

                dispatch({
                    type: 'SHOW_TOAST',
                    payload: `Session saved`
                })
            } catch (e) {
                console.error(e)
            }
        }

        sync()
    }, [state.timeLeft, state.isActive, state.initialTime, state.currentTaskId])

    return { state, dispatch };
};