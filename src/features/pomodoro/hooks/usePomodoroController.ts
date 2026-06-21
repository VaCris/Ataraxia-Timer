import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { db } from '@/infrastructure/database/db'
import { mapSettings } from '../mappers/mapSettings'
import {
    Mode,
    resetTimer,
    pauseTimer,
    resumeTimer,
    updateDurations,
    startTimer,
    restoreSession
} from '../store/timerSlice'
import { useTimer } from './useTimer'

export const usePomodoroController = () => {
    const dispatch = useDispatch()

    const apiSettings = useSelector((state: RootState) => state.settings.api)
    const timerState = useSelector((state: RootState) => state.timer)

    const settings = useMemo(() => mapSettings(apiSettings), [apiSettings])

    const [currentRound, setCurrentRound] = useState<number>(1)
    const [isSessionLoaded, setIsSessionLoaded] = useState(false)

    const [showModeModal, setShowModeModal] = useState(false)
    const [pendingMode, setPendingMode] = useState<Mode | null>(null)

    useEffect(() => {
        const loadSession = async () => {
            try {
                const savedSession = await db.timerSessions.get('current_session')
                if (savedSession) {
                    setCurrentRound(savedSession.currentRound)
                    dispatch(restoreSession({
                        mode: savedSession.mode,
                        timeLeft: savedSession.timeLeft,
                        initialTime: savedSession.initialTime,
                        isActive: savedSession.isActive,
                        isPaused: savedSession.isPaused
                    }))
                } else {
                    const savedRound = localStorage.getItem('ataraxia_currentRound')
                    if (savedRound) setCurrentRound(Number(savedRound))
                }
            } catch (error) {
                console.error("Error loading offline session:", error)
            } finally {
                setIsSessionLoaded(true)
            }
        }
        loadSession()
    }, [dispatch])

    useEffect(() => {
        if (!isSessionLoaded) return;

        localStorage.setItem('ataraxia_currentRound', currentRound.toString())

        const saveTimer = setTimeout(async () => {
            try {
                await db.timerSessions.put({
                    id: 'current_session',
                    mode: timerState.mode,
                    timeLeft: timerState.timeLeft,
                    initialTime: timerState.initialTime,
                    isActive: timerState.isActive,
                    isPaused: timerState.isPaused,
                    currentRound: currentRound,
                    lastUpdatedAt: Date.now()
                })
            } catch (error) {
                console.error("Error saving offline session:", error)
            }
        }, 1000)

        return () => clearTimeout(saveTimer)
    }, [
        timerState.mode,
        timerState.timeLeft,
        timerState.isActive,
        timerState.isPaused,
        currentRound,
        isSessionLoaded
    ])

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
        if (timerState.isActive || timerState.isPaused || !isSessionLoaded) return

        const duration = getDurationForMode(timerState.mode)
        const seconds = duration * 60

        if (
            timerState.initialTime !== seconds &&
            timerState.timeLeft === timerState.initialTime
        ) {
            dispatch(updateDurations({ mode: timerState.mode, duration }))
        }
    }, [
        dispatch,
        getDurationForMode,
        timerState.initialTime,
        timerState.isActive,
        timerState.isPaused,
        timerState.mode,
        timerState.timeLeft,
        isSessionLoaded
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
                dispatch(startTimer())
            }, 1200)
        }
    }, [settings, timerState.mode, currentRound, dispatch])

    useTimer(handleTimerComplete)

    const handleModeChange = useCallback(
        (newMode: Mode) => {
            if (newMode === timerState.mode) return;

            const isTimerIntact = !timerState.isActive && !timerState.isPaused && timerState.timeLeft === timerState.initialTime;

            if (isTimerIntact) {
                const duration = getDurationForMode(newMode);
                dispatch(updateDurations({ mode: newMode, duration }));
            } else {
                setPendingMode(newMode);
                setShowModeModal(true);
            }
        },
        [dispatch, getDurationForMode, timerState.mode, timerState.isActive, timerState.isPaused, timerState.timeLeft, timerState.initialTime]
    )

    const confirmModeChange = useCallback(() => {
        if (pendingMode) {
            const duration = getDurationForMode(pendingMode);
            dispatch(updateDurations({ mode: pendingMode, duration }));
        }
        setShowModeModal(false);
        setPendingMode(null);
    }, [dispatch, getDurationForMode, pendingMode])

    const cancelModeChange = useCallback(() => {
        setShowModeModal(false);
        setPendingMode(null);
    }, [])

    const toggleSession = useCallback(() => {
        if (timerState.isActive) {
            dispatch(pauseTimer())
            return
        }

        if (timerState.isPaused) {
            dispatch(resumeTimer())
            return
        }

        dispatch(startTimer())
    }, [dispatch, timerState.isActive, timerState.isPaused])

    const resetSession = useCallback(() => {
        const duration = getDurationForMode(timerState.mode)
        dispatch(resetTimer(duration * 60))
    }, [dispatch, timerState.mode, getDurationForMode])

    return {
        mode: timerState.mode,
        isActive: timerState.isActive,
        timeLeft: timerState.timeLeft,
        initialTime: timerState.initialTime,
        isPaused: timerState.isPaused,
        currentRound,
        showModeModal,
        confirmModeChange,
        cancelModeChange,
        handleTimerComplete,
        handleModeChange,
        toggleSession,
        resetSession,
    }
}