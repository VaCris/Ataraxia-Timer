import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/context/AuthContext';
import { PomodoroProvider } from '@context/PomodoroContext';
import { MusicProvider } from '@context/MusicContext';
import { AudioProvider } from '@context/AudioContext';
import ThemeProvider from '@context/ThemeContext';
import { processSyncQueue } from '@api/syncManager';

import Dashboard from '@/app/layout/Dashboard';
import ResetPassword from '@/features/auth/components/ResetPassword';
import UpdatePrompt from '@components/layout/UpdatePrompt';
import InstallPrompt from '@components/layout/InstallPrompt';
import CookieConsent from '@components/layout/CookieConsent';
import Maintenance from '@pages/Maintenance';
import ComingSoon from '@pages/ComingSoon';
import Restricted from '@pages/Restricted';

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const isComingSoon = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  const isRestricted = import.meta.env.VITE_RESTRICT_ACCESS === 'true';

  const [activeView, setActiveView] = useState('main');

  useEffect(() => {
    if (!isMaintenance && !isComingSoon && !isRestricted) {
      if (navigator.onLine) processSyncQueue();
      const handleOnline = () => processSyncQueue();
      window.addEventListener('online', handleOnline);
      return () => window.removeEventListener('online', handleOnline);
    }
  }, [isMaintenance, isComingSoon, isRestricted]);

  if (isRestricted) return <Restricted />;
  if (isMaintenance) return <Maintenance />;
  if (isComingSoon) return <ComingSoon />;

  const renderHomeContent = () => {
    if (isComingSoon) return <ComingSoon />;

    if (['games', 'stats', 'achievements'].includes(activeView)) {
      return (
        <ComingSoon
          type={activeView}
          onBack={() => setActiveView('main')}
        />
      );
    }

    return (
      <Dashboard
        onOpenGames={() => setActiveView('games')}
        onOpenStats={() => setActiveView('stats')}
        onOpenAchievements={() => setActiveView('achievements')}
      />
    );
  };

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <UpdatePrompt />
      <InstallPrompt />
      <CookieConsent />

      <AudioProvider>
        <PomodoroProvider>
          <MusicProvider>
            <ThemeProvider>
              <Routes>
                <Route path="/" element={renderHomeContent()} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ThemeProvider>
          </MusicProvider>
        </PomodoroProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;