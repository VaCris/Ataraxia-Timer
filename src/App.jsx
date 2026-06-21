import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { processSyncQueue } from './infrastructure/sync/syncManager';
import { checkAuthRequest } from './features/auth/store/authSlice';
import { fetchTasksRequest } from './features/tasks/store/tasksSlice';

import InstallPrompt from './app/components/InstallPrompt';
import Maintenance from './app/pages/Maintenance';
import ComingSoon from './app/pages/ComingSoon';
import Restricted from './app/pages/Restricted';
import { Loader } from './shared/ui/feedback/Loader';

const Dashboard = lazy(() => import('./app/layout/Dashboard'));
const ResetPassword = lazy(() => import('./features/auth/components/ResetPassword'));

function App() {
  const dispatch = useDispatch();

  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  const isComingSoon = import.meta.env.VITE_COMING_SOON_MODE === 'true';
  const isRestricted = import.meta.env.VITE_RESTRICT_ACCESS === 'true';

  const [activeView, setActiveView] = useState('main');
  const [isBooting, setIsBooting] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('ataraxia_theme') || 'dark';
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    
    if (storedTheme === 'light') {
      root.classList.add('theme-light');
    } else if (storedTheme === 'dark') {
      root.classList.add('theme-dark');
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemDark ? 'theme-dark' : 'theme-light');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) dispatch(checkAuthRequest());
  }, [dispatch]);

  useEffect(() => {
    if (isMaintenance || isComingSoon || isRestricted) return;

    const syncAndRefresh = async () => {
      const token = localStorage.getItem('token');
      if (!navigator.onLine || !token) {
        setIsBooting(false);
        return;
      }
      await processSyncQueue();
      dispatch(fetchTasksRequest());
      setIsBooting(false);
    };

    syncAndRefresh();
    window.addEventListener('online', syncAndRefresh);
    document.addEventListener('visibilitychange', syncAndRefresh);

    return () => {
      window.removeEventListener('online', syncAndRefresh);
      document.removeEventListener('visibilitychange', syncAndRefresh);
    };
  }, [dispatch, isMaintenance, isComingSoon, isRestricted]);

  if (isRestricted) return <Restricted />;
  if (isMaintenance) return <Maintenance />;
  if (isComingSoon) return <ComingSoon />;

  const renderHomeContent = () => {
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
    <>
      <Loader
        isLoading={isBooting}
        fullScreen={true}
        onComplete={() => setIsReady(true)}
      />

      <Toaster position="top-right" />
      <InstallPrompt />

      {isReady && (
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={renderHomeContent()} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      )}
    </>
  );
}

export default App;