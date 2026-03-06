import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

import { useStats } from '@hooks/useStats';
import { useSettings as useApiSettings } from '@hooks/useSettings';
import { usePip } from '@hooks/usePip';
import { usePomodoro } from '@context/PomodoroContext';
import { useTimer } from '@hooks/useTimer';

import Sidebar from '@components/layout/Sidebar';
import Header from '@components/layout/Header';
import StatsOverview from '@components/layout/StatsOverview';
import TimerDial from '@components/timer/TimerDial';
import TaskManager from '@components/tasks/TaskManager';
import SettingsModal from '@components/layout/SettingsModal';
import SupportModal from '@components/layout/SupportModal';
import MusicWidget from '@components/layout/MusicWidget';
import Toast from '@components/layout/Toast';
import PipPortal from '@components/timer/PipPortal';

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#e11d48');
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '225 29 72';
};

const Dashboard = () => {
    const { progress, refresh: refreshStats } = useStats();
    const { settings: apiSettings } = useApiSettings();
    const { pipContainer, togglePip } = usePip();
    
    const { state, dispatch } = useTimer(refreshStats);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const { bgImage, blurIntensity, accentColor } = useSelector(state => state.settings);
    const accentRgb = useMemo(() => hexToRgb(accentColor), [accentColor]);

    const handleTogglePip = async () => {
        if (pipContainer && pipWindowRef.current) {
            pipWindowRef.current.close();
            return;
        }

        try {
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 400,
                height: 450,
            });

            const style = pip.document.createElement('style');
            style.textContent = `body { margin: 0; padding: 0; background: #050505; overflow: hidden; }`;
            pip.document.head.appendChild(style);

            pip.addEventListener("pagehide", () => {
                pipWindowRef.current = null;
                setPipContainer(null);
            });

            pipWindowRef.current = pip;
            setPipContainer(pip.document.body);
        } catch (error) {
            console.error("PiP failed:", error);
        }
    };

    useEffect(() => {
        const syncSessionWithApi = async () => {
            if (state.timeLeft === 0 && !state.isActive) {
                try {
                    const dto = {
                        mode: state.mode.toLowerCase(),
                        duration: state.initialTime / 60,
                        taskId: state.currentTaskId || null
                    };

                    await timersService.create(dto);
                    refreshStats();

                    dispatch({
                        type: 'SHOW_TOAST',
                        payload: `Session saved! +${state.mode === 'FOCUS' ? '25' : '5'} XP`
                    });
                } catch (error) {
                    console.error("Error synchronising session:", error);
                }
            }
        };

        syncSessionWithApi();
    }, [state.timeLeft, state.isActive, state.mode, state.initialTime, state.currentTaskId, refreshStats, dispatch]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex w-screen h-screen overflow-hidden text-cream"
            style={{
                '--color-accent': accentColor || '#e11d48',
                '--color-accent-rgb': accentRgb
            }}
        >
            <div
                className="fixed inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                    backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: `blur(${blurIntensity || 0}px) brightness(0.45)`,
                    transform: 'scale(1.1)',
                    zIndex: -1
                }}
            />

            <Sidebar
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSupport={() => setIsSupportOpen(true)}
            />

            <main className="z-10 relative flex flex-col flex-1 h-full overflow-hidden">
                <Header userStats={progress} />

                <div className="flex flex-col flex-1 px-4 md:px-8 pb-4 md:pb-6 min-h-0">
                    {/* <div className="mb-4 shrink-0">
                        <StatsOverview data={progress} />
                    </div> */}

                    <div className="flex-1 gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-0">
                        <section className="relative flex flex-col justify-center items-center lg:col-span-7 shadow-2xl p-6 rounded-[2.5rem] min-h-0 overflow-hidden glass">
                            <button
                                onClick={handleTogglePip}
                                className={`absolute top-6 right-6 p-2.5 rounded-xl transition-all z-10 ${pipContainer ? 'bg-accent text-white shadow-glow' : 'bg-white/5 text-white/20 hover:text-white'
                                    }`}
                            >
                                <ExternalLink size={16} />
                            </button>

                            <div className="flex gap-1.5 bg-black/40 mb-6 p-1 border border-white/5 rounded-2xl scale-90">
                                {['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => dispatch({ type: 'SET_MODE', payload: m })}
                                        className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${state.mode === m
                                                ? 'bg-surface text-accent shadow-glow border border-white/10'
                                                : 'text-white/30 hover:text-white/60'
                                            }`}
                                    >
                                        {m.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>

                            <div className="scale-90 xl:scale-100 transition-transform">
                                <TimerDial isPipMode={false} />
                            </div>

                            <div className="flex items-center gap-4 mt-8">
                                <button
                                    onClick={() => dispatch({ type: 'TOGGLE_TIMER' })}
                                    className={`px-10 py-4 rounded-2xl font-black text-xs tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${state.isActive
                                            ? 'bg-transparent border-2 border-accent text-accent'
                                            : 'bg-accent text-white shadow-glow'
                                        }`}
                                >
                                    {state.isActive ? 'PAUSE' : 'START SESSION'}
                                </button>

                                <button
                                    onClick={() => dispatch({ type: 'RESET_TIMER' })}
                                    className="bg-white/5 hover:bg-white/10 p-4 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-colors"
                                >
                                    <motion.div whileTap={{ rotate: -180 }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                            <path d="M3 3v5h5" />
                                        </svg>
                                    </motion.div>
                                </button>
                            </div>
                        </section>

                        <section className="flex flex-col lg:col-span-5 h-full min-h-0">
                            <TaskManager />
                        </section>
                    </div>
                </div>

                <div className="bottom-6 left-6 z-50 absolute">
                    <MusicWidget />
                </div>
            </main>

            <PipPortal pipContainer={pipContainer} accentColor={accentColor} accentRgb={accentRgb} />
            
            <Toast
                isOpen={state.toast.isOpen}
                message={state.toast.message}
                onClose={() => dispatch({ type: 'HIDE_TOAST' })}
            />

            <AnimatePresence>
                {isSettingsOpen && (
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                        initialData={apiSettings}
                    />
                )}
                {isSupportOpen && <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;