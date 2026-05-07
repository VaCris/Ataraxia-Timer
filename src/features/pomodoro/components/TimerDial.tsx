import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { TimerMode } from '../models/PomodoroSettings';

interface PomodoroController {
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
        <div className="relative flex justify-center items-center w-72 md:w-[26rem] h-72 md:h-[26rem]">
            <svg className="drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] w-full h-full -rotate-90 transform">
                <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="opacity-10 fill-none"
                    style={{ stroke: 'var(--color-accent)' }}
                    strokeWidth="1.5"
                />
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    className="fill-none"
                    style={{ stroke: 'var(--color-accent)', filter: 'drop-shadow(0 0 12px var(--color-accent))' }}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: progress }}
                    transition={{ duration: 0.5, ease: "linear" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <div className="flex items-center font-black text-white md:text-[7rem] text-8xl italic leading-none tracking-tighter">
                    {minutes}
                    <span
                        style={{ color: 'var(--color-accent)' }}
                        className={`mx-1 ${timerState.isActive ? 'animate-pulse' : ''}`}
                    >
                        :
                    </span>
                    {seconds}
                </div>
                <div className="flex flex-col items-center gap-2 mt-4">
                    <span className="font-black text-[12px] text-white/20 md:text-sm italic uppercase tracking-[0.6em]">
                        {timerState.mode.replace('_', ' ')}
                    </span>
                    <div
                        className="px-5 py-1.5 border rounded-full"
                        style={{
                            backgroundColor: 'rgba(var(--color-accent-rgb), 0.15)',
                            borderColor: 'rgba(var(--color-accent-rgb), 0.3)'
                        }}
                    >
                        <span
                            className="font-black text-[11px] md:text-xs uppercase tracking-[0.3em]"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            ROUND {controller.currentRound} <span className="opacity-30 mx-1">/</span> {longBreakInterval}
                        </span>
                    </div>
                </div>
            </div>
            <div
                className={`absolute inset-0 rounded-full blur-[100px] transition-opacity duration-1000 -z-10 ${timerState.isActive ? 'opacity-20' : 'opacity-0'}`}
                style={{ backgroundColor: 'var(--color-accent)' }}
            />
        </div>
    );
});

TimerDial.displayName = 'TimerDial';

export default TimerDial;