import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { mapSettings } from '../mappers/mapSettings'
import {
    Mode,
    resetTimer,
    toggleTimer,
    updateDurations,
} from '../store/timerSlice'
import { useTimer } from './useTimer'

export const usePomodoroController = () => {
    const dispatch = useDispatch()

    const apiSettings = useSelector((state: RootState) => state.settings.api)
    const timerState = useSelector((state: RootState) => state.timer)

    const settings = useMemo(() => mapSettings(apiSettings), [apiSettings])

    const [currentRound, setCurrentRound] = useState<number>(() => {
        const saved = localStorage.getItem('ataraxia_currentRound')
        return saved ? Number(saved) : 1
    })

    useEffect(() => {
        localStorage.setItem('ataraxia_currentRound', currentRound.toString())
    }, [currentRound])

    const getDurationForMode = useCallback(
        (mode: Mode): number => {
            switch (mode) {
                case 'SHORT_BREAK':
                    return settings.shortBreakDuration
                case 'LONG_BREAK':
                    return settings.longBreakDuration
                case 'FOCUS':
                default:
                    return settings.focusDuration
            }
        },
        [settings]
    )

    useEffect(() => {
        if (timerState.isActive) return

        const duration = getDurationForMode(timerState.mode)
        const seconds = duration * 60

        if (timerState.initialTime !== seconds || timerState.timeLeft !== seconds) {
            dispatch(updateDurations({ mode: timerState.mode, duration }))
        }
    }, [
        dispatch,
        getDurationForMode,
        timerState.initialTime,
        timerState.isActive,
        timerState.mode,
        timerState.timeLeft,
    ])

    const handleTimerComplete = useCallback(() => {
        let nextMode: Mode = 'FOCUS'
        let nextDuration = settings.focusDuration
        let shouldAutoStart = false

        if (timerState.mode === 'FOCUS') {
            if (currentRound >= settings.longBreakInterval) {
                nextMode = 'LONG_BREAK'
                nextDuration = settings.longBreakDuration
            } else {
                nextMode = 'SHORT_BREAK'
                nextDuration = settings.shortBreakDuration
            }

            shouldAutoStart = settings.autoStartBreaks
        } else {
            const isFromLongBreak = timerState.mode === 'LONG_BREAK'

            setCurrentRound((prevRound) =>
                isFromLongBreak ? 1 : prevRound + 1
            )

            nextMode = 'FOCUS'
            nextDuration = settings.focusDuration
            shouldAutoStart = settings.autoStartPomodoros
        }

        dispatch(updateDurations({ mode: nextMode, duration: nextDuration }))

        if (shouldAutoStart) {
            window.setTimeout(() => {
                dispatch(toggleTimer())
            }, 1200)
        }
    }, [settings, timerState.mode, currentRound, dispatch])

    useTimer(handleTimerComplete)

    const handleModeChange = useCallback(
        (mode: Mode) => {
            const duration = getDurationForMode(mode)
            dispatch(updateDurations({ mode, duration }))
        },
        [dispatch, getDurationForMode]
    )

    const toggleSession = useCallback(() => {
        dispatch(toggleTimer())
    }, [dispatch])

    const resetSession = useCallback(() => {
        const duration = getDurationForMode(timerState.mode)
        dispatch(resetTimer(duration * 60))
    }, [dispatch, timerState.mode, getDurationForMode])

    return {
        mode: timerState.mode,
        isActive: timerState.isActive,
        timeLeft: timerState.timeLeft,
        initialTime: timerState.initialTime,
        currentRound,
        handleTimerComplete,
        handleModeChange,
        toggleSession,
        resetSession,
    }
}
