import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@context/AuthContext';
import { PomodoroProvider } from '@context/PomodoroContext';
import { MusicProvider } from '@context/MusicContext';
import { AudioProvider } from '@context/AudioContext';

import { useNotifications } from '@hooks/useNotifications';

import Dashboard from '@components/layout/Dashboard';
import ResetPassword from '@components/auth/ResetPassword';
import UpdatePrompt from '@components/layout/UpdatePrompt';
import InstallPrompt from '@components/layout/InstallPrompt';
import CookieConsent from '@components/layout/CookieConsent';
import Maintenance from '@pages/Maintenance';
import { processSyncQueue } from '@api/syncManager';

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
          sendUpdateNotification(`Update V${data.version}`, data.changelog, data.targetUrl);
          localStorage.setItem('ataraxia_version', data.version);
        }
      } catch (e) { console.error("Update check failed"); }
    };
    checkUpdates();
  }, [permission]);
  return null;
};

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  useEffect(() => {
    if (navigator.onLine) processSyncQueue();
    const handleOnline = () => processSyncQueue();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  if (isMaintenance) return <Maintenance />;

  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', fontSize: '12px' } }} />

      <UpdatePrompt />
      <InstallPrompt />
      <CookieConsent />
      <VersionManager />

      <AudioProvider>
        <PomodoroProvider>
          <MusicProvider>
            <Routes>
              <Route path="/" element={<Dashboard />} />
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