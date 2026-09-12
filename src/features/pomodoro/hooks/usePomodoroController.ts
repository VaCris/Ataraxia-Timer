import { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { gamificationService } from '../../gamification/api/gamification.api'
import type { RootState } from '@/store'
import { db } from '@/infrastructure/database/db'
import { ensureCurrentOwnerData } from '@/infrastructure/database/ownerMigration'
import { getCurrentRoundStorageKey, getTimerSessionStorageId } from '@/infrastructure/database/localOwner'
import { mapSettings } from '../mappers/mapSettings'
import {
    Mode,
    resetTimer,
    pauseTimer,
    resumeTimer,
    updateDurations,
    startTimer,
    restoreSession,
    setServerId
} from '../store/timerSlice'
import { useTimer } from './useTimer'
import { TimerControllerService } from '@/infrastructure/api/generated/services/TimerControllerService'
import { TimerRequestDto } from '@/infrastructure/api/generated/models/TimerRequestDto'

const canUseRemoteServices = () =>
    navigator.onLine && Boolean(localStorage.getItem('token'))

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
                const ownerId = await ensureCurrentOwnerData()
                const savedSession = await db.timerSessions.get(getTimerSessionStorageId(ownerId))
                if (savedSession && savedSession.ownerId === ownerId) {
                    setCurrentRound(savedSession.currentRound)
                    dispatch(restoreSession({
                        mode: savedSession.mode,
                        timeLeft: savedSession.timeLeft,
                        initialTime: savedSession.initialTime,
                        isActive: savedSession.isActive,
                        isPaused: savedSession.isPaused
                    }))
                } else {
                    const savedRound = localStorage.getItem(getCurrentRoundStorageKey(ownerId))
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

        let cancelled = false
        let saveTimer: ReturnType<typeof setTimeout> | null = null

        const persistSession = async () => {
            try {
                const ownerId = await ensureCurrentOwnerData()
                if (cancelled) return

                localStorage.setItem(getCurrentRoundStorageKey(ownerId), currentRound.toString())

                saveTimer = setTimeout(async () => {
                    try {
                        await db.timerSessions.put({
                            id: getTimerSessionStorageId(ownerId),
                            ownerId,
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
            } catch (error) {
                console.error("Error preparing offline session persistence:", error)
            }
        }

        persistSession()

        return () => {
            cancelled = true
            if (saveTimer) clearTimeout(saveTimer)
        }
    }, [
        timerState.mode,
        timerState.timeLeft,
        timerState.initialTime,
        timerState.isActive,
        timerState.isPaused,
        currentRound,
        isSessionLoaded
    ])

    const getDurationForMode = useCallback(
        (mode: Mode): number => {
            let duration: number;
            switch (mode) {
                case 'SHORT_BREAK':
                    duration = settings.shortBreakLength;
                    break;
                case 'LONG_BREAK':
                    duration = settings.longBreakLength;
                    break;
                case 'FOCUS':
                default:
                    duration = settings.pomodoroLength;
                    break;
            }
            return Number.isFinite(duration) && duration > 0 ? duration : 25;
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

    const handleStartTimer = useCallback(async (mode: Mode, duration: number) => {
        dispatch(startTimer());

        if (!canUseRemoteServices()) return;

        try {
            const modeMap: Record<Mode, TimerRequestDto.mode> = {
                'FOCUS': TimerRequestDto.mode.POMODORO,
                'SHORT_BREAK': TimerRequestDto.mode.SHORT_BREAK,
                'LONG_BREAK': TimerRequestDto.mode.LONG_BREAK
            };

            const res = await TimerControllerService.createTimer({
                duration: duration,
                mode: modeMap[mode]
            });

            if (res.id) {
                dispatch(setServerId(res.id));
            }
        } catch (error) {
            console.error("Failed to create timer in backend:", error);
        }
    }, [dispatch]);

    const handleTimerComplete = useCallback(async () => {
        if (timerState.serverId && canUseRemoteServices()) {
            try {
                await TimerControllerService.completeTimer(timerState.serverId);
            } catch (error) {
                console.error("Failed to complete timer in backend:", error);
            }
        }

        let nextMode: Mode = 'FOCUS'
        let shouldAutoStart = false

        if (timerState.mode === 'FOCUS') {
            if (canUseRemoteServices()) {
                gamificationService.checkAchievements().catch(console.error);
            }

            if (currentRound >= settings.longBreakInterval) {
                nextMode = 'LONG_BREAK'
            } else {
                nextMode = 'SHORT_BREAK'
            }

            shouldAutoStart = settings.autoStartBreaks
        } else {
            const isFromLongBreak = timerState.mode === 'LONG_BREAK'

            setCurrentRound((prevRound) =>
                isFromLongBreak ? 1 : prevRound + 1
            )

            nextMode = 'FOCUS'
            shouldAutoStart = settings.autoStartPomodoros
        }

        const nextDuration = getDurationForMode(nextMode)
        dispatch(updateDurations({ mode: nextMode, duration: nextDuration }))

        if (shouldAutoStart) {
            window.setTimeout(() => {
                handleStartTimer(nextMode, nextDuration);
            }, 1200)
        }
    }, [settings, timerState.mode, timerState.serverId, currentRound, dispatch, handleStartTimer, getDurationForMode])

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
        setShowModeModal(false)
        setPendingMode(null)
    }, [dispatch, getDurationForMode, pendingMode])

    const cancelModeChange = useCallback(() => {
        setShowModeModal(false)
        setPendingMode(null)
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

        handleStartTimer(timerState.mode, timerState.initialTime / 60);
    }, [dispatch, timerState.isActive, timerState.isPaused, timerState.mode, timerState.initialTime, handleStartTimer])

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
