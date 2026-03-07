import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PomodoroProvider } from '@context/PomodoroContext';
import { MusicProvider } from '@context/MusicContext';
import { AudioProvider } from '@context/AudioContext';
import { AuthProvider } from '@context/AuthContext';
import { useNotifications } from '@hooks/useNotifications';
import Dashboard from '@components/layout/Dashboard';
import ResetPassword from '@components/auth/ResetPassword';
import UpdatePrompt from '@components/layout/UpdatePrompt';
import InstallPrompt from '@components/layout/InstallPrompt';
import CookieConsent from '@components/layout/CookieConsent';
import { Toaster } from 'react-hot-toast';
import { processSyncQueue } from '@api/syncManager';
import Maintenance from '@pages/Maintenance';
import ComingSoon from '@pages/ComingSoon';
import Restricted from '@pages/Restricted';

const VersionManager = () => {
  const { sendUpdateNotification, permission } = useNotifications();

  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const response = await fetch('/version.json?v=' + Date.now());
        if (!response.ok) return;
        const data = await response.json();
        const savedVersion = localStorage.getItem('ataraxia_version');

        if (data.version !== savedVersion && permission === 'granted') {
          sendUpdateNotification(
            `System Update V${data.version}`,
            data.changelog,
            data.targetUrl
          );
          localStorage.setItem('ataraxia_version', data.version);
        }
      } catch (error) {
        console.error("Update check failed");
      }
    };

    checkUpdates();
  }, [permission]);

  return null;
};

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const isComingSoonEnv = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  const isRestricted = import.meta.env.VITE_RESTRICT_ACCESS === 'true';

  const [activeView, setActiveView] = useState('main');

  useEffect(() => {
    if (navigator.onLine) {
      processSyncQueue();
    }
    const handleOnline = () => processSyncQueue();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  if (isRestricted) return <Restricted />;
  if (isMaintenance) return <Maintenance />;

  const renderHomeContent = () => {
    if (isComingSoonEnv) return <ComingSoon />;

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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '12px',
          },
        }}
      />
      <UpdatePrompt />
      <InstallPrompt />
      <CookieConsent />
      <AudioProvider>
        <PomodoroProvider>
          <MusicProvider>
            <BrowserRouter>
              <VersionManager />
              <Routes>
                <Route path="/" element={renderHomeContent()} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </MusicProvider>
        </PomodoroProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;