import React from 'react';
import { motion } from 'framer-motion';
import { usePomodoro } from '@context/PomodoroContext';

const TimerDial = ({ isPipMode = false }) => {
    const { state } = usePomodoro();
    
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;

    const totalSeconds = (state.settings?.[state.mode] || 25) * 60;
    const progress = ((totalSeconds - state.timeLeft) / totalSeconds);

    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    return (
        <div className={`relative flex justify-center items-center ${
            isPipMode ? 'w-full h-full' : 'w-64 md:w-80 h-64 md:h-80'
        }`}>
            <svg className={`drop-shadow-2xl -rotate-90 transform ${isPipMode ? 'w-[90%] h-[90%]' : 'w-full h-full'}`}>
                <circle
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                    className="fill-none stroke-white/5"
                    strokeWidth={isPipMode ? "4" : "2"}
                />

                <motion.circle
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                    className="fill-none stroke-accent"
                    strokeWidth={isPipMode ? "6" : "3"}
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    style={{
                        strokeDasharray: circumference,
                        filter: 'drop-shadow(0 0 8px var(--color-accent))'
                    }}
                />
            </svg>

            <div className="absolute flex flex-col items-center">
                <motion.div
                    key={state.timeLeft}
                    initial={{ opacity: 0.8, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`font-black text-cream tracking-tighter ${
                        isPipMode ? 'text-[22vw]' : 'text-6xl md:text-8xl'
                    }`}
                >
                    {String(minutes).padStart(2, '0')}
                    <span className="text-accent animate-pulse">:</span>
                    {String(seconds).padStart(2, '0')}
                </motion.div>

                <span className={`font-bold text-white/30 uppercase tracking-[0.4em] ${
                    isPipMode ? 'text-[3vw] mt-1' : 'text-[10px] md:text-xs mt-2'
                }`}>
                    {state.mode.replace('_', ' ')}
                </span>
            </div>

            {!isPipMode && (
                <div className={`absolute inset-0 rounded-full bg-accent/5 blur-3xl transition-opacity duration-1000 ${
                    state.isActive ? 'opacity-100' : 'opacity-0'
                }`} />
            )}
        </div>
    );
};

export default TimerDial;