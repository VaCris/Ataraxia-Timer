import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Play, Pause, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';

import { RootState } from '@/store';
import { usePomodoroController } from '../hooks/usePomodoroController';
import { usePipController } from '../hooks/usePipController';
import { useUISettings } from '@/features/settings/hooks/useUISettings';
import { useThemeEffect } from '@/app/providers/theme/useThemeEffect';

import Sidebar from '@/app/layout/Sidebar';
import Header from '@/app/layout/Header';
import BottomNav from '@/app/layout/BottomNav';
import TimerDial from './TimerDial';
import TaskManager from '@/features/tasks/components/TaskManager';
import SettingsModal from '@/features/settings/components/SettingsModal';
import SupportModal from '@/shared/ui/modals/SupportModal';
import MusicWidget from '@/features/pomodoro/components/MusicWidget';
import PipPortal from './PipPortal';

interface DashboardViewProps {
  onOpenGames: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenGames,
  onOpenStats,
  onOpenAchievements,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);
  const [isMusicOpen, setIsMusicOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const uiSettings = useUISettings();
  const pomodoroController = usePomodoroController();
  const { pipWindow, togglePip } = usePipController();

  const timerState = useSelector((state: RootState) => state.timer);
  const apiSettings = useSelector((state: RootState) => state.settings.api);

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
      className="relative flex bg-surface selection:bg-white/20 w-screen h-screen overflow-hidden text-white"
      style={{ '--color-accent': uiSettings.accentColor } as React.CSSProperties}
    >
      <div
        className="z-0 fixed inset-0 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: uiSettings.bgImage ? `url(${uiSettings.bgImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: uiSettings.bgImage ? 1 : 0,
        }}
      />

      <div className="z-0 absolute inset-0 bg-surface/40 backdrop-blur-[2px] pointer-events-none" />

      <Sidebar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenMusic={toggleMusic}
        isMusicOpen={isMusicOpen}
        customShortcuts={uiSettings.customShortcuts}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="z-10 relative flex flex-col flex-1 lg:ml-24 pb-20 lg:pb-0">
        <Header
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <div className="flex flex-col flex-1 justify-center items-center gap-10 md:gap-14 mx-auto px-6 pt-8 w-full max-w-4xl">
          <TimerDial controller={pomodoroController} />

          <div className="flex justify-center items-center gap-3 bg-white/5 shadow-2xl backdrop-blur-md p-2 border border-white/10 rounded-full">
            <button
              type="button"
              onClick={togglePip}
              className="hover:bg-white/10 p-4 rounded-full text-white/50 hover:text-white transition-all duration-300"
              aria-label="Picture in Picture"
            >
              <ExternalLink size={22} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={pomodoroController.toggleSession}
              className="flex justify-center items-center gap-2 bg-accent px-10 py-4 rounded-full min-w-50 font-black text-white uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--color-accent-rgb),0.6)]"
            >
              {timerState.isActive ? (
                <>
                  <Pause size={20} fill="currentColor" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play size={20} fill="currentColor" />
                  <span>{timerState.isPaused ? 'Resume' : 'Start'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={pomodoroController.resetSession}
              className="hover:bg-white/10 p-4 rounded-full text-white/50 hover:text-white transition-all duration-300"
              aria-label="Reset Timer"
            >
              <RotateCcw size={22} strokeWidth={2.5} />
            </button>
          </div>

          <div className="opacity-90 hover:opacity-100 w-full max-w-md transition-opacity duration-300">
            <TaskManager />
          </div>
        </div>
      </main>

      <BottomNav
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGames={onOpenGames}
        onOpenStats={onOpenStats}
        onOpenAchievements={onOpenAchievements}
      />

      {pipWindow && (
        <PipPortal
          pipWindow={pipWindow}
          currentRound={pomodoroController.currentRound}
          longBreakInterval={apiSettings?.longBreakInterval || 4}
          mode={timerState.mode}
          timeLeft={timerState.timeLeft}
          initialTime={timerState.initialTime}
          isActive={timerState.isActive}
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

export default DashboardView;