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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            className="dashboard-root"
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
                isMobileOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSupport={() => setIsSupportOpen(true)}
                onOpenGames={onOpenGames}
                onOpenStats={onOpenStats}
                onOpenAchievements={onOpenAchievements}
                onOpenMusic={toggleMusic}
                isMusicOpen={isMusicOpen}
                customShortcuts={uiSettings.customShortcuts}
            />

            <main className="dashboard-main">
                <Header
                    is24Hour={uiSettings.is24Hour}
                    accentColor={uiSettings.accentColor}
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                />

                <section className="dashboard-grid">
                    <div className="dashboard-timer-zone">
                        <div className="timer-stack">
                            <TimerDial controller={pomodoro} />

                            <div className="mode-tabs">
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
                                            className={`mode-tab ${isActive
                                                ? 'bg-accent text-white shadow-[0_0_18px_rgba(var(--color-accent-rgb),0.45)]'
                                                : 'text-white/30 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="timer-actions">
                                <button
                                    type="button"
                                    onClick={pip.togglePip}
                                    disabled={!pip.isPipSupported}
                                    className="timer-icon-action"
                                    aria-label="Picture in Picture"
                                    title={
                                        pip.isPipSupported
                                            ? 'Picture in Picture'
                                            : 'Picture in Picture is not supported in this browser'
                                    }
                                >
                                    <ExternalLink size={19} />
                                </button>

                                <button
                                    type="button"
                                    onClick={pomodoro.toggleSession}
                                    className="timer-primary-action"
                                >
                                    {pomodoro.isActive ? (
                                        <>
                                            <Pause size={19} fill="currentColor" />
                                            PAUSE
                                        </>
                                    ) : (
                                        <>
                                            <Play size={19} fill="currentColor" />
                                            START
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={pomodoro.resetSession}
                                    className="timer-icon-action"
                                    aria-label="Reset Timer"
                                >
                                    <RotateCcw size={19} />
                                </button>
                            </div>

                            {pip.pipError && (
                                <p className="max-w-md text-[10px] text-red-400/80 text-center uppercase tracking-widest">
                                    {pip.pipError}
                                </p>
                            )}
                        </div>
                    </div>

                    <aside className="task-panel-zone">
                        <div className="task-panel-shell">
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
                    isPaused={pomodoro.isPaused}
                    toggleSession={pomodoro.toggleSession}
                    resetSession={pomodoro.resetSession}
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

                {pomodoro.showModeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#1a1a1a] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center"
                        >
                            <h3 className="text-xl font-bold mb-2 text-white">Change mode?</h3>
                            <p className="text-white/60 mb-6">Your current session will be reset.</p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={pomodoro.cancelModeChange}
                                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium text-white/80"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={pomodoro.confirmModeChange}
                                    className="flex-1 py-3 px-4 rounded-xl bg-accent hover:opacity-90 transition-opacity font-bold text-white shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.3)]"
                                >
                                    Change Mode
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
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