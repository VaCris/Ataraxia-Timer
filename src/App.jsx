import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { useTimer } from './hooks/useTimer';
import useLocalStorage from './hooks/useLocalStorage';
import { usePip } from './hooks/usePip';
import { useAuth } from './context/auth-context';
import { useSyncSettings } from './hooks/useSyncSettings';
import { MusicProvider } from './context/music-context';
import { AchievementProvider } from './context/achievement-context';
import { syncManager } from './api/sync.manager';

import Header from './components/layout/Header';
import MissionLog from './components/tasks/MissionLog';
import SettingsModal from './components/layout/SettingsModal';
import TimerWidget from './components/timer/TimerWidget';
import IntroScreen from './components/layout/IntroScreen';
import MusicWidget from './components/layout/MusicWidget';
import SupportModal from './components/layout/SupportModal';
import SpotifyCallback from './components/layout/SpotifyCallback';
import LeftDock from './components/layout/LeftDock';
import RightDock from './components/layout/RightDock';
import PipPortal from './components/timer/PipPortal';
import MaintenancePage from './components/layout/MaintenancePage';

import './styles/global.css';

function App() {
  const { user, token, loginAsGuest, logout, loading } = useAuth();
  const { pipWindow, togglePip } = usePip();
  const navigate = useNavigate();

  const [bgImage, setBgImage] = useLocalStorage('dw-background', '');
  const [accentColor, setAccentColor] = useLocalStorage('dw-color', '#8b5cf6');
  const [timerSettings, setTimerSettings] = useLocalStorage('dw-times', { work: 25, short: 5, long: 15 });
  const [autoStart, setAutoStart] = useLocalStorage('dw-autostart', false);
  const [longBreakInterval, setLongBreakInterval] = useLocalStorage('dw-interval', 4);
  const [is24Hour, setIs24Hour] = useLocalStorage('dw-is24hour', false);
  const [volume, setVolume] = useLocalStorage('dw-volume', 0.5);

  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('dw-intro-seen'));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const [authAttempted, setAuthAttempted] = useState(false);

  const timer = useTimer('work', timerSettings, autoStart, longBreakInterval, volume);

  const syncSetters = useMemo(() => ({
    setTimerSettings,
    setLongBreakInterval,
    setAutoStart,
    setAccentColor
  }), [setTimerSettings, setLongBreakInterval, setAutoStart, setAccentColor]);

  useSyncSettings(user, token, isMaintenance, syncSetters);

  useEffect(() => {
    let pollingInterval;

    const waitForServerAndMigrate = async () => {
      const storedToken = localStorage.getItem('access_token');

      if (navigator.onLine && storedToken?.startsWith('offline_token_')) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          await fetch(`${apiUrl}/tags`, {
            method: 'HEAD',
            cache: 'no-store'
          });

          if (pollingInterval) clearInterval(pollingInterval);

          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('refresh_token');

          logout();
          setAuthAttempted(false);

        } catch (error) {
        }
      }
    };

    const handleConnectionChange = () => {
      if (navigator.onLine) {
        waitForServerAndMigrate();
        pollingInterval = setInterval(waitForServerAndMigrate, 5000);
      } else {
        if (pollingInterval) clearInterval(pollingInterval);
      }
    };

    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', () => clearInterval(pollingInterval));

    if (navigator.onLine) handleConnectionChange();

    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', () => clearInterval(pollingInterval));
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [logout]);

  useEffect(() => {
    if (navigator.onLine && !isMaintenance && user) {
      const timer = setTimeout(() => syncManager.syncAll(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isMaintenance, user]);

  useEffect(() => {
    const handleMaintenance = () => {
      const hasToken = localStorage.getItem('access_token');
      if (!hasToken) {
        setIsMaintenance(true);
        if (window.location.pathname !== '/maintenance') navigate('/maintenance');
      }
    };
    window.addEventListener('server:down', handleMaintenance);
    return () => window.removeEventListener('server:down', handleMaintenance);
  }, [navigate]);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');

    if (
      !loading && !user && !storedToken &&
      !showIntro && !isMaintenance &&
      navigator.onLine && !authAttempted
    ) {
      setAuthAttempted(true);
      loginAsGuest().catch(() => {
        setIsMaintenance(true);
      });
    }
  }, [loading, user, showIntro, isMaintenance, loginAsGuest, authAttempted]);

  const handleIntroComplete = async () => {
    sessionStorage.setItem('dw-intro-seen', 'true');
    setShowIntro(false);
    setAuthAttempted(false);
  };

  const toggleMute = () => setVolume(volume === 0 ? 0.5 : 0);
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  if (loading) return <div style={{ background: '#050505', width: '100%', height: '100vh' }} />;
  if (isMaintenance && !localStorage.getItem('access_token')) return <MaintenancePage />;

  return (
    <AchievementProvider>
      <MusicProvider>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }} />

        <Routes>
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/callback" element={<SpotifyCallback />} />

          <Route path="/*" element={
            <div style={{
              width: '100%',
              '--primary-color': accentColor,
              '--primary-glow': `${accentColor}80`
            }}>
              <div className="background-layer" style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }} />
              <div className="background-overlay" />

              {showIntro && <IntroScreen onComplete={handleIntroComplete} is24Hour={is24Hour} />}

              <PipPortal
                pipWindow={pipWindow}
                togglePip={togglePip}
                bgImage={bgImage}
                timerProps={{ ...timer, timerSettings }}
              />

              <MusicWidget />

              <div className="app-wrapper">
                <header className={`header-container ${timer.isActive ? 'hidden' : ''}`}>
                  <Header is24Hour={is24Hour} />
                </header>

                <main className="main-layout">
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', opacity: pipWindow ? 0.3 : 1 }}>
                    <TimerWidget
                      {...timer}
                      longBreakInterval={longBreakInterval}
                      timerSettings={timerSettings}
                      togglePip={togglePip}
                      isPipActive={!!pipWindow}
                    />
                  </div>
                  <section className="tasks-section">
                    <MissionLog key={user?.id || 'guest'} showAd={!timer.isActive} />
                  </section>
                </main>

                <LeftDock isActive={timer.isActive} />
                <RightDock
                  isActive={timer.isActive}
                  volume={volume}
                  setVolume={setVolume}
                  toggleMute={toggleMute}
                  setIsSettingsOpen={setIsSettingsOpen}
                  setIsSupportOpen={setIsSupportOpen}
                  toggleFullScreen={toggleFullScreen}
                />
              </div>

              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentBg={bgImage}
                onBgChange={setBgImage}
                accentColor={accentColor}
                onColorChange={setAccentColor}
                timerSettings={timerSettings}
                onTimerChange={setTimerSettings}
                autoStart={autoStart}
                onAutoStartChange={setAutoStart}
                longBreakInterval={longBreakInterval}
                onLongBreakIntervalChange={setLongBreakInterval}
                is24Hour={is24Hour}
                onFormatChange={setIs24Hour}
                volume={volume}
                onVolumeChange={setVolume}
              />
              <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
            </div>
          } />
        </Routes>
      </MusicProvider>
    </AchievementProvider>
  );
}

export default App;