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
        <div className="relative flex justify-center items-center w-[min(78vw,16rem)] h-[min(78vw,16rem)] xs:w-[17rem] xs:h-[17rem] sm:w-[18.5rem] sm:h-[18.5rem] md:w-[20rem] md:h-[20rem] lg:w-[20rem] lg:h-[20rem] xl:w-[22rem] xl:h-[22rem] 2xl:w-[27rem] 2xl:h-[27rem] 3xl:w-[30rem] 3xl:h-[30rem] shrink-0">
            <svg className="drop-shadow-[0_0_22px_rgba(0,0,0,0.45)] w-full h-full -rotate-90 transform">
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

            <div className="absolute flex flex-col items-center px-4 max-w-full">
                <div className="flex items-center font-black text-white text-[clamp(3.5rem,17vw,4.4rem)] xs:text-[4.5rem] sm:text-[5rem] md:text-[5.4rem] lg:text-[5.6rem] xl:text-[6.2rem] 2xl:text-[7.4rem] 3xl:text-[8.4rem] italic leading-none tracking-tighter">
                    {minutes}
                    <span
                        style={{ color: 'var(--color-accent)' }}
                        className={`mx-0.5 sm:mx-1 ${timerState.isActive ? 'animate-pulse' : ''}`}
                    >
                        :
                    </span>
                    {seconds}
                </div>

                <div className="flex flex-col items-center gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 2xl:mt-4">
                    <span className="font-black text-[9px] xs:text-[10px] sm:text-[11px] lg:text-[11px] 2xl:text-sm text-white/20 italic uppercase tracking-[0.32em] xs:tracking-[0.42em] sm:tracking-[0.48em] 2xl:tracking-[0.55em]">
                        {timerState.mode.replace('_', ' ')}
                    </span>

                    <div
                        className="px-3 xs:px-4 sm:px-4 2xl:px-5 py-1.5 border rounded-full"
                        style={{
                            backgroundColor: 'rgba(var(--color-accent-rgb), 0.15)',
                            borderColor: 'rgba(var(--color-accent-rgb), 0.3)',
                        }}
                    >
                        <span
                            className="font-black text-[9px] xs:text-[10px] sm:text-[11px] 2xl:text-xs uppercase tracking-[0.2em] xs:tracking-[0.22em] sm:tracking-[0.26em] 2xl:tracking-[0.3em]"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            ROUND {controller.currentRound}
                            <span className="opacity-30 mx-1">/</span>
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
