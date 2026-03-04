import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { usePip } from '@hooks/usePip';
import PipPortal from '@components/timer/PipPortal';
import Sidebar from '@components/layout/Sidebar';
import Header from '@components/layout/Header';
import StatsOverview from '@components/layout/StatsOverview';
import TimerDial from '@components/timer/TimerDial';
import TaskManager from '@components/tasks/TaskManager';
import SettingsModal from '@components/layout/SettingsModal';
import SupportModal from '@components/layout/SupportModal';
import MusicWidget from '@components/layout/MusicWidget';
import Toast from '@components/layout/Toast';
import { usePomodoro } from '@context/PomodoroContext';

const Dashboard = () => {
    const { state, dispatch } = usePomodoro();
    const { isPipActive, pipWindow, togglePip } = usePip();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const { bgImage, blurIntensity } = useSelector(state => state.settings);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex w-screen h-screen overflow-hidden text-cream"
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

            <div className="z-0 fixed inset-0 bg-black/10 pointer-events-none" />

            <Sidebar
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSupport={() => setIsSupportOpen(true)}
            />

            <main className="z-10 relative flex flex-col flex-1 h-full overflow-hidden">
                <div className="top-0 right-0 -z-10 absolute bg-accent/5 blur-[120px] rounded-full w-[40vw] h-[40vw] pointer-events-none" />

                <Header />

                <div className="flex flex-col flex-1 px-4 md:px-8 pb-4 md:pb-6 min-h-0">
                    <div className="mb-4 shrink-0">
                        <StatsOverview />
                    </div>

                    <div className="flex-1 gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-0">
                        <section className="relative flex flex-col justify-center items-center lg:col-span-7 shadow-2xl p-6 rounded-[2.5rem] min-h-0 overflow-hidden glass">
                            <button
                                onClick={togglePip}
                                className={`absolute top-6 right-6 p-2.5 rounded-xl transition-all z-10 ${isPipActive ? 'bg-accent text-white shadow-glow' : 'bg-white/5 text-white/20 hover:text-white'
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
                                <TimerDial />
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

            <PipPortal pipWindow={pipWindow} />

            <Toast
                isOpen={state.toast.isOpen}
                message={state.toast.message}
                onClose={() => dispatch({ type: 'HIDE_TOAST' })}
            />

            <AnimatePresence>
                {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                {isSupportOpen && <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;