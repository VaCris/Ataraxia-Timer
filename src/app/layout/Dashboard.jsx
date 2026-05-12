import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Pause, RotateCcw } from 'lucide-react';

import { usePomodoroController } from '@/features/pomodoro/hooks/usePomodoroController';
import { usePipController } from '@/features/pomodoro/hooks/usePipController';
import { useUISettings } from '@/features/settings/hooks/useUISettings';
import { useThemeEffect } from '@/app/providers/theme/useThemeEffect';

import Sidebar from '@/app/layout/Sidebar';
import Header from '@/app/layout/Header';
import TimerDial from '@/features/pomodoro/components/TimerDial';
import TaskManager from '@/features/tasks/components/TaskManager';
import SettingsModal from '@/features/settings/components/SettingsModal';
import SupportModal from '@/shared/ui/modals/SupportModal';
import MusicWidget from '@/features/pomodoro/components/MusicWidget';
import PipPortal from '@/features/pomodoro/components/PipPortal';

const Dashboard = ({ onOpenGames, onOpenStats, onOpenAchievements }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isMusicOpen, setIsMusicOpen] = useState(false);

    const uiSettings = useUISettings();
    const pomodoro = usePomodoroController();
    const pip = usePipController();

    const toggleMusic = () => {
        setIsMusicOpen((prev) => !prev);
    };

    const closeMusic = () => {
        setIsMusicOpen(false);
    };

    useThemeEffect(
        uiSettings.accentColor,
        uiSettings.bgImage,
        uiSettings.blurIntensity
    );

    return (
        <motion.div
            className="relative flex bg-[#030303] w-screen h-screen overflow-hidden text-white"
            style={{
                '--color-accent': uiSettings.accentColor,
            }}
        >
            <div
                className="z-0 fixed inset-0 transition-opacity duration-500 pointer-events-none"
                style={{
                    backgroundImage: uiSettings.bgImage ? `url(${uiSettings.bgImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: uiSettings.bgImage ? 1 : 0,
                }}
            />

            <div className="z-0 fixed inset-0 bg-black/70 pointer-events-none" />

            <Sidebar
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSupport={() => setIsSupportOpen(true)}
                onOpenGames={onOpenGames}
                onOpenStats={onOpenStats}
                onOpenAchievements={onOpenAchievements}
                onOpenMusic={toggleMusic}
                isMusicOpen={isMusicOpen}
                customShortcuts={uiSettings.customShortcuts}
            />

            <main className="z-10 relative flex flex-col flex-1 min-w-0 h-screen">
                <Header is24Hour={uiSettings.is24Hour} />

                <section className="flex-1 gap-8 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] px-6 sm:px-10 xl:px-14 pb-8 min-h-0">
                    <div className="flex flex-col justify-center items-center min-w-0">
                        <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
                            <TimerDial controller={pomodoro} />

                            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl p-2 border border-white/10 rounded-full">
                                {[
                                    { label: 'Focus', value: 'FOCUS' },
                                    { label: 'Short', value: 'SHORT_BREAK' },
                                    { label: 'Long', value: 'LONG_BREAK' },
                                ].map((item) => {
                                    const isActive = pomodoro.mode === item.value;

                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => pomodoro.handleModeChange(item.value)}
                                            className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${isActive
                                                    ? 'bg-accent text-white shadow-[0_0_18px_rgba(var(--color-accent-rgb),0.45)]'
                                                    : 'text-white/30 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex justify-center items-center gap-4 bg-white/5 shadow-2xl backdrop-blur-xl p-3 border border-white/10 rounded-full">
                                <button
                                    type="button"
                                    onClick={pip.togglePip}
                                    className="flex justify-center items-center hover:bg-white/10 rounded-full w-12 h-12 text-white/50 hover:text-white transition-all"
                                    aria-label="Picture in Picture"
                                >
                                    <ExternalLink size={20} />
                                </button>

                                <button
                                    type="button"
                                    onClick={pomodoro.toggleSession}
                                    className="flex justify-center items-center gap-3 bg-accent px-10 rounded-full min-w-40 h-14 font-black text-white text-xs uppercase tracking-[0.2em] active:scale-95 transition-all"
                                >
                                    {pomodoro.isActive ? (
                                        <>
                                            <Pause size={18} fill="currentColor" />
                                            PAUSE
                                        </>
                                    ) : (
                                        <>
                                            <Play size={18} fill="currentColor" />
                                            START
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={pomodoro.resetSession}
                                    className="flex justify-center items-center hover:bg-white/10 rounded-full w-12 h-12 text-white/50 hover:text-white transition-all"
                                    aria-label="Reset Timer"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="flex justify-center xl:justify-end items-center min-w-0 min-h-0">
                        <div className="w-full max-w-[420px] h-[min(620px,calc(100vh-180px))]">
                            <TaskManager />
                        </div>
                    </aside>
                </section>
            </main>

            {pip.pipWindow && (
                <PipPortal
                    pipWindow={pip.pipWindow}
                    currentRound={pomodoro.currentRound}
                />
            )}

            <AnimatePresence>
                {isSettingsOpen && (
                    <SettingsModal
                        isOpen={isSettingsOpen}
                        onClose={() => setIsSettingsOpen(false)}
                    />
                )}

                {isSupportOpen && (
                    <SupportModal
                        isOpen={isSupportOpen}
                        onClose={() => setIsSupportOpen(false)}
                    />
                )}
            </AnimatePresence>

            <MusicWidget
                isOpen={isMusicOpen}
                onClose={closeMusic}
            />
        </motion.div>
    );
};

export default Dashboard;