import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { processSyncQueue } from '@/infrastructure/sync/syncManager';
import { checkAuthRequest } from '@/features/auth/store/authSlice';

import Dashboard from '@/app/layout/Dashboard';
import ResetPassword from '@/features/auth/components/ResetPassword';
import UpdatePrompt from '@/app/components/UpdatePrompt';
import InstallPrompt from '@/app/components/InstallPrompt';
import CookieConsent from '@/app/components/CookieConsent';
import Maintenance from '@/app/pages/Maintenance';
import ComingSoon from '@/app/pages/ComingSoon';
import Restricted from '@/app/pages/Restricted';

function App() {
  const dispatch = useDispatch();

  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const isComingSoon = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  const isRestricted = import.meta.env.VITE_RESTRICT_ACCESS === 'true';

  const [activeView, setActiveView] = useState('main');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      dispatch(checkAuthRequest());
    }
  }, [dispatch]);

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
    <>
      <Toaster position="top-right" />
      <UpdatePrompt />
      <InstallPrompt />
      <CookieConsent />

      <Routes>
        <Route path="/" element={renderHomeContent()} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;