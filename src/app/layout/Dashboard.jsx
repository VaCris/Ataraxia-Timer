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
