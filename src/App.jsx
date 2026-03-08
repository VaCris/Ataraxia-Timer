import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@context/AuthContext';
import { PomodoroProvider } from '@context/PomodoroContext';
import { MusicProvider } from '@context/MusicContext';
import { AudioProvider } from '@context/AudioContext';
import { processSyncQueue } from '@api/syncManager';

import Dashboard from '@components/layout/Dashboard';
import ResetPassword from '@components/auth/ResetPassword';
import UpdatePrompt from '@components/layout/UpdatePrompt';
import InstallPrompt from '@components/layout/InstallPrompt';
import CookieConsent from '@components/layout/CookieConsent';
import Maintenance from '@pages/Maintenance';
import ComingSoon from '@pages/ComingSoon';
import Restricted from '@pages/Restricted';

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const isComingSoonEnv = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  const isRestricted = import.meta.env.VITE_RESTRICT_ACCESS === 'true';

  const [activeView, setActiveView] = useState('main');

  useEffect(() => {
    if (!isMaintenance && !isComingSoonEnv && !isRestricted) {
      if (navigator.onLine) processSyncQueue();
      const handleOnline = () => processSyncQueue();
      window.addEventListener('online', handleOnline);
      return () => window.removeEventListener('online', handleOnline);
    }
  }, [isMaintenance, isComingSoonEnv, isRestricted]);

  if (isRestricted) return <Restricted />;
  if (isMaintenance) return <Maintenance />;

  const renderHomeContent = () => {
    if (isComingSoonEnv) return <ComingSoon />;
    
    if (['games', 'stats', 'achievements'].includes(activeView)) {
      return <ComingSoon type={activeView} onBack={() => setActiveView('main')} />;
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
            <Routes>
              <Route path="/" element={renderHomeContent()} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </MusicProvider>
        </PomodoroProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;