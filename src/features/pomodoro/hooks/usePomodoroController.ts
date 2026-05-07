import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { mapSettings } from '../mappers/mapSettings'
import { Mode, setMode, updateDurations, toggleTimer, resetTimer } from '../store/timerSlice'
import { setInitialTime } from '../store/pomodoroSlice'

export const usePomodoroController = () => {
    const dispatch = useDispatch()

    const settingsItem = useSelector((state: RootState) => state.settings)
    const timerState = useSelector((state: RootState) => state.timer)

    const settings = useMemo(() => mapSettings(settingsItem), [settingsItem])

    const [currentRound, setCurrentRound] = useState<number>(() => {
        const saved = localStorage.getItem('ataraxia_currentRound')
        return saved ? Number(saved) : 1
    })

    useEffect(() => {
        localStorage.setItem('ataraxia_currentRound', currentRound.toString())
    }, [currentRound])

    const getDurationForMode = useCallback((mode: Mode): number => {
        switch (mode) {
            case 'SHORT_BREAK':
                return settings.shortBreakDuration
            case 'LONG_BREAK':
                return settings.longBreakDuration
            case 'FOCUS':
            default:
                return settings.focusDuration
        }
    }, [settings])

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
            setCurrentRound((prev) => (isFromLongBreak ? 1 : prev + 1))

            nextMode = 'FOCUS'
            nextDuration = settings.focusDuration
            shouldAutoStart = settings.autoStartPomodoros
        }

        dispatch(setMode(nextMode))
        dispatch(updateDurations({ mode: nextMode, duration: nextDuration }))
        dispatch(setInitialTime(nextDuration * 60))

        if (shouldAutoStart) {
            setTimeout(() => dispatch(toggleTimer()), 1200)
        }
    }, [settings, timerState.mode, currentRound, dispatch])

    const handleModeChange = useCallback((mode: Mode) => {
        const duration = getDurationForMode(mode)
        dispatch(setMode(mode))
        dispatch(updateDurations({ mode, duration }))
        dispatch(setInitialTime(duration * 60))
    }, [dispatch, getDurationForMode])

    const toggleSession = useCallback(() => {
        dispatch(toggleTimer())
    }, [dispatch])

    const resetSession = useCallback(() => {
        const duration = getDurationForMode(timerState.mode)
        dispatch(resetTimer(duration * 60))
        dispatch(setInitialTime(duration * 60))
    }, [dispatch, timerState.mode, getDurationForMode])

    return {
        currentRound,
        handleTimerComplete,
        handleModeChange,
        toggleSession,
        resetSession
    }
}