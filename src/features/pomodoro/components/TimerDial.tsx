import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { TimerMode } from '../models/PomodoroSettings';

interface PomodoroController {
    mode: TimerMode;
    isActive: boolean;
    timeLeft: number;
    initialTime: number;
    currentRound: number;
    handleTimerComplete: () => void;
    handleModeChange: (mode: TimerMode) => void;
    toggleSession: () => void;
    resetSession: () => void;
}

interface TimerDialProps {
    controller: PomodoroController;
    isPipActive?: boolean;
    onTogglePip?: () => Promise<void>;
    isPipSupported?: boolean;
}

export const TimerDial: React.FC<TimerDialProps> = memo(({ controller }) => {
    const timerState = useSelector((state: RootState) => state.timer);
    const apiSettings = useSelector((state: RootState) => state.settings.api);

    const longBreakInterval = apiSettings?.longBreakInterval ?? 4;

    const { minutes, seconds, progress } = useMemo(() => {
        const m = String(Math.floor(timerState.timeLeft / 60)).padStart(2, '0');
        const s = String(timerState.timeLeft % 60).padStart(2, '0');
        const p = timerState.initialTime > 0 ? timerState.timeLeft / timerState.initialTime : 1;

        return { minutes: m, seconds: s, progress: p };
    }, [timerState.timeLeft, timerState.initialTime]);

    return (
        <div className="timer-dial">
            <svg className="drop-shadow-[0_0_22px_rgba(0,0,0,0.45)] w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="opacity-10 fill-none"
                    style={{ stroke: 'var(--color-accent)' }}
                    strokeWidth="1.5"
                />

                <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    className="fill-none"
                    style={{
                        stroke: 'var(--color-accent)',
                        filter: 'drop-shadow(0 0 10px var(--color-accent))',
                    }}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: progress }}
                    transition={{ duration: 0.5, ease: 'linear' }}
                />
            </svg>

            <div className="timer-content absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-6 max-w-full">
                <div className="timer-digits flex items-center font-black text-white italic leading-none tracking-tighter tabular-nums">
                    {minutes}
                    <span
                        style={{ color: 'var(--color-accent)' }}
                        className={`timer-separator mx-1 sm:mx-2 ${timerState.isActive ? 'animate-pulse' : ''}`}
                    >
                        :
                    </span>
                    {seconds}
                </div>

                <div className="timer-meta flex flex-col items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 2xl:mt-5">
                    <span className="timer-mode-label font-black text-[10px] sm:text-[11px] 2xl:text-xs text-white/40 italic uppercase tracking-[0.24em] sm:tracking-[0.32em] 2xl:tracking-[0.38em]">
                        {timerState.mode.replace('_', ' ')}
                    </span>

                    <div
                        className="timer-round-badge px-3.5 sm:px-4.5 2xl:px-5 py-1.5 border rounded-full"
                        style={{
                            backgroundColor: 'rgba(var(--color-accent-rgb), 0.15)',
                            borderColor: 'rgba(var(--color-accent-rgb), 0.3)',
                        }}
                    >
                        <span
                            className="font-black text-[9px] xs:text-[10px] sm:text-[11px] 2xl:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] 2xl:tracking-[0.24em]"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            ROUND {controller.currentRound}
                            <span className="opacity-45 mx-1">/</span>
                            {longBreakInterval}
                        </span>
                    </div>
                </div>
            </div>

            <div
                className={`absolute inset-2 sm:inset-3 rounded-full blur-[55px] sm:blur-[70px] 2xl:blur-[100px] transition-opacity duration-1000 -z-10 ${timerState.isActive ? 'opacity-[0.18]' : 'opacity-0'}`}
                style={{ backgroundColor: 'var(--color-accent)' }}
            />
        </div>
    );
});

TimerDial.displayName = 'TimerDial';

export default TimerDial;
