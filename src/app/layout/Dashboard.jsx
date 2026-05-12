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

<<<<<<< HEAD
                <section className="flex-1 gap-6 lg:gap-8 2xl:gap-12 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(400px,480px)] px-4 sm:px-8 2xl:px-20 xl:px-12 pb-6 sm:pb-8 min-h-0 xl:overflow-hidden overflow-y-auto">
                    <div className="flex flex-col justify-center items-center py-4 xl:py-0 min-w-0 min-h-0">
                        <div className="flex flex-col items-center gap-6 sm:gap-7 xl:gap-8 w-full max-w-[58rem]">
                            <TimerDial controller={pomodoro} />

                            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-xl p-2.5 border border-white/10 rounded-full">
=======
                <section className="flex-1 gap-5 sm:gap-6 xl:gap-8 2xl:gap-10 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(340px,400px)] px-4 sm:px-8 xl:px-10 2xl:px-14 pb-5 sm:pb-8 min-h-0">
                    <div className="flex flex-col justify-center items-center min-w-0 min-h-0">
                        <div className="flex flex-col items-center gap-5 sm:gap-6 xl:gap-7 w-full max-w-[44rem]">
                            <TimerDial controller={pomodoro} />

                            <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-xl p-1.5 border border-white/10 rounded-full">
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
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
<<<<<<< HEAD
                                            className={`px-4 sm:px-5 xl:px-6 py-2 xl:py-2.5 rounded-full font-black text-[9px] sm:text-[10px] xl:text-[11px] uppercase tracking-[0.18em] xl:tracking-[0.2em] transition-all ${isActive
                                                ? 'bg-accent text-white shadow-[0_0_18px_rgba(var(--color-accent-rgb),0.45)]'
                                                : 'text-white/30 hover:text-white hover:bg-white/10'
=======
                                            className={`px-4 sm:px-5 py-2 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-[0.18em] transition-all ${isActive
                                                    ? 'bg-accent text-white shadow-[0_0_18px_rgba(var(--color-accent-rgb),0.45)]'
                                                    : 'text-white/30 hover:text-white hover:bg-white/10'
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>

<<<<<<< HEAD
                            <div className="flex justify-center items-center gap-3 sm:gap-4 bg-white/5 shadow-2xl backdrop-blur-xl p-2.5 sm:p-3 border border-white/10 rounded-full">
=======
                            <div className="flex justify-center items-center gap-3 bg-white/5 shadow-2xl backdrop-blur-xl p-2.5 border border-white/10 rounded-full">
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                                <button
                                    type="button"
                                    onClick={pip.togglePip}
                                    disabled={!pip.isPipSupported}
<<<<<<< HEAD
                                    className="flex justify-center items-center hover:bg-white/10 disabled:hover:bg-transparent disabled:opacity-30 rounded-full w-11 sm:w-12 xl:w-[3.25rem] h-11 sm:h-12 xl:h-[3.25rem] text-white/50 hover:text-white transition-all"
=======
                                    className="flex justify-center items-center hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent rounded-full w-11 h-11 text-white/50 hover:text-white transition-all"
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                                    aria-label="Picture in Picture"
                                    title={
                                        pip.isPipSupported
                                            ? 'Picture in Picture'
                                            : 'Picture in Picture is not supported in this browser'
                                    }
                                >
<<<<<<< HEAD
                                    <ExternalLink size={22} />
=======
                                    <ExternalLink size={19} />
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                                </button>

                                <button
                                    type="button"
                                    onClick={pomodoro.toggleSession}
<<<<<<< HEAD
                                    className="flex justify-center items-center gap-3 bg-accent px-8 sm:px-10 xl:px-12 rounded-full min-w-36 sm:min-w-40 xl:min-w-48 h-12 sm:h-14 xl:h-16 font-black text-[11px] text-white sm:text-xs xl:text-sm uppercase tracking-[0.2em] xl:tracking-[0.22em] active:scale-95 transition-all"
=======
                                    className="flex justify-center items-center gap-3 bg-accent px-8 sm:px-10 rounded-full min-w-36 sm:min-w-40 h-13 sm:h-14 font-black text-white text-[11px] sm:text-xs uppercase tracking-[0.2em] active:scale-95 transition-all"
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                                >
                                    {pomodoro.isActive ? (
                                        <>
                                            <Pause size={20} fill="currentColor" />
                                            PAUSE
                                        </>
                                    ) : (
                                        <>
                                            <Play size={20} fill="currentColor" />
                                            START
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={pomodoro.resetSession}
<<<<<<< HEAD
                                    className="flex justify-center items-center hover:bg-white/10 rounded-full w-14 h-14 text-white/50 hover:text-white transition-all"
                                    aria-label="Reset Timer"
                                >
                                    <RotateCcw size={22} />
=======
                                    className="flex justify-center items-center hover:bg-white/10 rounded-full w-11 h-11 text-white/50 hover:text-white transition-all"
                                    aria-label="Reset Timer"
                                >
                                    <RotateCcw size={19} />
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                                </button>
                            </div>

                            {pip.pipError && (
                                <p className="max-w-md text-[10px] text-red-400/80 text-center uppercase tracking-widest">
                                    {pip.pipError}
                                </p>
                            )}
                        </div>
                    </div>

                    <aside className="flex justify-center xl:justify-end items-center min-w-0 min-h-0">
<<<<<<< HEAD
                        <div className="w-full max-w-[420px] xl:max-w-[480px] h-[min(620px,calc(100vh-170px))] xl:h-[min(680px,calc(100vh-150px))]">
=======
                        <div className="w-full max-w-[400px] h-[min(600px,calc(100vh-170px))]">
>>>>>>> a6fe17b66fca010cff6e54cfa69c0328cbc5bef5
                            <TaskManager />
                        </div>
                    </aside>
                </section>
            </main>

            {pip.pipWindow && (
                <PipPortal
                    pipWindow={pip.pipWindow}
                    currentRound={pomodoro.currentRound}
                    longBreakInterval={uiSettings.longBreakInterval}
                    mode={pomodoro.mode}
                    timeLeft={pomodoro.timeLeft}
                    initialTime={pomodoro.initialTime}
                    isActive={pomodoro.isActive}
                    accentColor={uiSettings.accentColor}
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
