import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Pause, RotateCcw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { TEXTS } from '@/shared/constants/texts.constants';

import { usePomodoroController } from '@/features/pomodoro/hooks/usePomodoroController';
import { usePipController } from '@/features/pomodoro/hooks/usePipController';
import { useUISettings } from '@/features/settings/hooks/useUISettings';
import { useThemeEffect } from '@/app/providers/theme/useThemeEffect';
import { updateUISettings, updateSettingsRequest } from '@/features/settings/store/settingsSlice';
import { sanitizeForCss } from '@/shared/utils/sanitize';

import Sidebar from '@/app/layout/Sidebar';
import Header from '@/app/layout/Header';
import TimerDial from '@/features/pomodoro/components/TimerDial';
import TaskManager from '@/features/tasks/components/TaskManager';
import PipPortal from '@/features/pomodoro/components/PipPortal';
import PaintTransitionOverlay from '@/app/components/PaintTransitionOverlay';
import ThemeChangeIndicator from '@/app/components/ThemeChangeIndicator';

const SettingsModal = React.lazy(() => import('@/features/settings/components/SettingsModal'));
const SupportModal = React.lazy(() => import('@/shared/ui/modals/SupportModal'));
const MusicWidget = React.lazy(() => import('@/features/pomodoro/components/MusicWidget'));
const ProfileModal = React.lazy(() => import('@/features/profile/components/ProfileModal'));
const StatsModal = React.lazy(() => import('@/features/stats/components/StatsModal'));
const GamificationModal = React.lazy(() => import('@/features/gamification/components/GamificationModal'));

const THEME_INDICATOR_DURATION_MS = 1600;

const Dashboard = ({ onOpenGames }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isMusicOpen, setIsMusicOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
    const [themeIndicator, setThemeIndicator] = useState({ visible: false, theme: 'dark' });

    const uiSettings = useUISettings();
    const pomodoro = usePomodoroController();
    const pip = usePipController();

    const dispatch = useDispatch();
    const triggerPaintRef = useRef(null);
    const themeIndicatorTimerRef = useRef(null);

    const toggleMusic = () => {
        setIsMusicOpen((prev) => !prev);
    };

    const closeMusic = () => {
        setIsMusicOpen(false);
    };

    const applyThemeChange = useCallback((newTheme) => {
        localStorage.setItem('ataraxia_theme', newTheme);
        dispatch(updateUISettings({ theme: newTheme }));
        dispatch(updateSettingsRequest({ theme: newTheme }));
    }, [dispatch]);

    const showThemeIndicator = useCallback((theme) => {
        if (themeIndicatorTimerRef.current) {
            window.clearTimeout(themeIndicatorTimerRef.current);
        }

        setThemeIndicator({ visible: true, theme });
        themeIndicatorTimerRef.current = window.setTimeout(() => {
            setThemeIndicator((current) => ({ ...current, visible: false }));
            themeIndicatorTimerRef.current = null;
        }, THEME_INDICATOR_DURATION_MS);
    }, []);

    useEffect(() => () => {
        if (themeIndicatorTimerRef.current) {
            window.clearTimeout(themeIndicatorTimerRef.current);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const currentTheme = uiSettings.theme || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (triggerPaintRef.current) {
            triggerPaintRef.current(nextTheme);
        }

        applyThemeChange(nextTheme);
        showThemeIndicator(nextTheme);
    }, [uiSettings.theme, applyThemeChange, showThemeIndicator]);

    useThemeEffect(
        uiSettings.accentColor,
        uiSettings.bgImage,
        uiSettings.blurIntensity,
        uiSettings.theme
    );

    return (
        <motion.div
            className={`dashboard-root ${uiSettings.isDefaultBackground ? 'dashboard-default-background' : ''}`}
            style={{
                '--color-accent': uiSettings.accentColor,
            }}
        >
            <div
                className={`z-0 fixed inset-0 transition-opacity duration-500 pointer-events-none dashboard-background-image ${uiSettings.isDefaultBackground ? 'dashboard-background-image--default' : ''}`}
                style={{
                    backgroundImage: uiSettings.bgImage ? `url(${sanitizeForCss(uiSettings.bgImage)})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: uiSettings.bgImage ? 1 : 0,
                }}
            />

            <div className={`z-0 fixed inset-0 bg-black/70 pointer-events-none dashboard-glass-overlay ${uiSettings.isDefaultBackground ? 'dashboard-glass-overlay--default' : ''}`} />

            <Sidebar
                isMobileOpen={isSidebarOpen}
                onCloseMobile={() => setIsSidebarOpen(false)}
                onOpenSettings={() => setIsSettingsOpen((prev) => !prev)}
                onOpenSupport={() => setIsSupportOpen((prev) => !prev)}
                onOpenGames={onOpenGames}
                onOpenStats={() => setIsStatsOpen((prev) => !prev)}
                onOpenAchievements={() => setIsAchievementsOpen((prev) => !prev)}
                onOpenMusic={toggleMusic}
                isMusicOpen={isMusicOpen}
                customShortcuts={uiSettings.customShortcuts}
                theme={uiSettings.theme}
                onToggleTheme={toggleTheme}
            />

            <main className="dashboard-main">
                <Header
                    is24Hour={uiSettings.is24Hour}
                    accentColor={uiSettings.accentColor}
                    onOpenSidebar={() => setIsSidebarOpen(true)}
                    onOpenProfile={() => setIsProfileOpen((prev) => !prev)}
                />

                <section className="dashboard-grid">
                    <div className="dashboard-timer-zone">
                        <div className="timer-stack">
                            <TimerDial controller={pomodoro} />

                            <div className="mode-tabs">
                                {[
                                    { label: TEXTS.dashboard.focus, value: 'FOCUS' },
                                    { label: TEXTS.dashboard.shortBreak, value: 'SHORT_BREAK' },
                                    { label: TEXTS.dashboard.longBreak, value: 'LONG_BREAK' },
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
                                            {TEXTS.dashboard.pause}
                                        </>
                                    ) : (
                                        <>
                                            <Play size={19} fill="currentColor" />
                                            {TEXTS.dashboard.start}
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
                    bgImage={uiSettings.bgImage}
                    blurIntensity={uiSettings.blurIntensity}
                />
            )}

            <ThemeChangeIndicator
                theme={themeIndicator.theme}
                visible={themeIndicator.visible}
                accentColor={uiSettings.accentColor}
            />

            <AnimatePresence>
                {isSettingsOpen && (
                    <React.Suspense fallback={null}>
                        <SettingsModal
                            isOpen={isSettingsOpen}
                            onClose={() => setIsSettingsOpen(false)}
                        />
                    </React.Suspense>
                )}

                {isSupportOpen && (
                    <React.Suspense fallback={null}>
                        <SupportModal
                            isOpen={isSupportOpen}
                            onClose={() => setIsSupportOpen(false)}
                        />
                    </React.Suspense>
                )}

                {isProfileOpen && (
                    <React.Suspense fallback={null}>
                        <ProfileModal
                            isOpen={isProfileOpen}
                            onClose={() => setIsProfileOpen(false)}
                        />
                    </React.Suspense>
                )}

                {isStatsOpen && (
                    <React.Suspense fallback={null}>
                        <StatsModal
                            isOpen={isStatsOpen}
                            onClose={() => setIsStatsOpen(false)}
                        />
                    </React.Suspense>
                )}

                {isAchievementsOpen && (
                    <React.Suspense fallback={null}>
                        <GamificationModal
                            isOpen={isAchievementsOpen}
                            onClose={() => setIsAchievementsOpen(false)}
                        />
                    </React.Suspense>
                )}

                {pomodoro.showModeModal && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mode-modal-title"
                        aria-describedby="mode-modal-desc"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20, rotateX: 5 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-[#050505]/95 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-[2rem] max-w-sm w-full text-center ring-1 ring-white/5"
                            style={{ perspective: '1000px' }}
                        >
                            <h3 id="mode-modal-title" className="text-xl sm:text-2xl font-black mb-2 text-white italic tracking-tight uppercase">Change Mode?</h3>
                            <p id="mode-modal-desc" className="text-white/40 mb-8 text-[11px] sm:text-xs uppercase tracking-widest">Your current session will be reset.</p>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={pomodoro.cancelModeChange}
                                    className="flex-1 py-4 px-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-white/60 hover:text-white uppercase text-[10px] sm:text-[11px] tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={pomodoro.confirmModeChange}
                                    style={{ backgroundColor: uiSettings.accentColor }}
                                    className="flex-1 py-4 px-4 rounded-2xl transition-all font-black text-white uppercase text-[10px] sm:text-[11px] tracking-[0.2em] shadow-[0_8px_24px_-10px_rgba(var(--color-accent-rgb),0.4)] hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 active:scale-95"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <React.Suspense fallback={null}>
                <MusicWidget
                    isOpen={isMusicOpen}
                    onClose={closeMusic}
                />
            </React.Suspense>

            <PaintTransitionOverlay
                triggerRef={triggerPaintRef}
                onMidpoint={() => {}}
            />
        </motion.div>
    );
};

export default Dashboard;
