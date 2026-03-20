import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const TimerDial = memo(({ isPipMode, currentRound = 1 }) => {
    const settings = useSelector(state => state.settings.item || {});
    const timerState = useSelector(state => state.timer);
    const { accentColor = '', longBreakInterval = 4, focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settings;

    const { minutes, seconds, strokeDashoffset, circumference } = useMemo(() => {
        let tm = timerState.mode === 'SHORT_BREAK' ? shortBreakDuration : timerState.mode === 'LONG_BREAK' ? longBreakDuration : focusDuration;
        const ts = tm * 60;
        const vts = ts > 0 ? ts : 1;
        const p = (vts - timerState.timeLeft) / vts;
        const r = 45;
        const c = 2 * Math.PI * r;
        return {
            minutes: String(Math.floor(timerState.timeLeft / 60)).padStart(2, '0'),
            seconds: String(timerState.timeLeft % 60).padStart(2, '0'),
            circumference: c,
            strokeDashoffset: c - p * c
        };
    }, [timerState.timeLeft, timerState.mode, focusDuration, shortBreakDuration, longBreakDuration]);

    return (
        <div className="relative flex justify-center items-center w-72 md:w-[26rem] h-72 md:h-[26rem]">
            <svg className="drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] w-full h-full -rotate-90 transform">
                <circle cx="50%" cy="50%" r="45%" className="fill-none" style={{ stroke: accentColor, opacity: 0.1 }} strokeWidth="1.5" />
                <motion.circle
                    cx="50%" cy="50%" r="45%" className="fill-none"
                    style={{ stroke: accentColor, filter: `drop-shadow(0 0 12px ${accentColor})` }}
                    strokeWidth="4" strokeLinecap="round"
                    animate={{ strokeDashoffset }} transition={{ duration: 0.5, ease: "linear" }}
                    strokeDasharray={circumference}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <div className="font-black text-white md:text-[7rem] text-8xl italic leading-none tracking-tighter">
                    {minutes}<span style={{ color: accentColor }} className="mx-1 animate-pulse">:</span>{seconds}
                </div>
                <div className="flex flex-col items-center gap-2 mt-4">
                    <span className="font-black text-[12px] text-white/20 md:text-sm italic uppercase tracking-[0.6em]">{timerState.mode.replace('_', ' ')}</span>
                    <div className="px-5 py-1.5 border rounded-full" style={{ backgroundColor: `${accentColor}15`, borderColor: `${accentColor}30`, boxShadow: `0 0 20px ${accentColor}10` }}>
                        <span className="font-black text-[11px] md:text-xs uppercase tracking-[0.3em]" style={{ color: accentColor }}>ROUND {currentRound} <span className="opacity-30 mx-1">/</span> {longBreakInterval}</span>
                    </div>
                </div>
            </div>
            <div className={`absolute inset-0 rounded-full blur-[100px] transition-opacity duration-1000 -z-10 ${timerState.isActive ? 'opacity-20' : 'opacity-0'}`} style={{ backgroundColor: accentColor }} />
        </div>
    );
});

export default TimerDial;