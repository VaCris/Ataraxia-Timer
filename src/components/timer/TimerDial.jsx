import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePomodoro } from '@context/PomodoroContext';
import { useSelector } from 'react-redux';
import { Clock } from 'lucide-react';

const TimerDial = ({ isPipMode = false }) => {
    const { state } = usePomodoro();
    const is24Hour = useSelector(state => state.settings.is24Hour);
    const accentColor = useSelector(state => state.settings.accentColor);
    const longBreakInterval = useSelector(state => state.settings.longBreakInterval) || 4;
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const totalSeconds = (state.settings?.[state.mode] || 25) * 60;
    const progress = ((totalSeconds - state.timeLeft) / totalSeconds);
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className="relative flex justify-center items-center w-72 md:w-[26rem] h-72 md:h-[26rem]">
            <svg className="drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] w-full h-full -rotate-90 transform">
                <circle cx="50%" cy="50%" r={`${radius}%`} className="fill-none stroke-white/5" strokeWidth="1.5" />
                <motion.circle
                    cx="50%" cy="50%" r={`${radius}%`}
                    className="fill-none"
                    style={{ stroke: accentColor, filter: `drop-shadow(0 0 12px ${accentColor})` }}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    strokeDasharray={circumference}
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <motion.div key={state.timeLeft} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} className="font-black text-white md:text-[9rem] text-8xl italic leading-none tracking-tighter">
                    {String(minutes).padStart(2, '0')}
                    <span style={{ color: accentColor }} className="mx-1 animate-pulse">:</span>
                    {String(seconds).padStart(2, '0')}
                </motion.div>

                <div className="flex flex-col items-center gap-2 mt-4">
                    <span className="font-black text-[12px] text-white/20 md:text-sm italic uppercase tracking-[0.6em]">
                        {state.mode.replace('_', ' ')}
                    </span>
                    <div className="bg-accent/10 px-5 py-1.5 border border-accent/20 rounded-full" style={{ boxShadow: `0 0 20px ${accentColor}10` }}>
                        <span className="font-black text-[11px] text-accent md:text-xs uppercase tracking-[0.3em]">
                            ROUND {state.sessionsUntilLongBreak || 1} <span className="opacity-30 mx-1">/</span> {longBreakInterval}
                        </span>
                    </div>
                </div>
            </div>

            <div className={`absolute inset-0 rounded-full blur-[100px] transition-opacity duration-1000 -z-10 ${state.isActive ? 'opacity-20' : 'opacity-0'}`} style={{ backgroundColor: accentColor }} />
        </div>
    );
};

export default TimerDial;