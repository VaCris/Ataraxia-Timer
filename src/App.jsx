import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import { fetchSettingsRequest } from './store/slices/settingsSlice';
import { fetchTasksRequest } from './store/slices/tasksSlice';
import { useTimer } from './hooks/useTimer';
import { usePip } from './hooks/usePip';
import { useAuth } from './context/auth-context';
import { MusicProvider } from './context/music-context';
import { AchievementProvider } from './context/achievement-context';

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
import AchievementHub from './components/achievements/AchievementHub';

import './styles/global.css';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    timerSettings, autoStart, longBreakInterval,
    accentColor, bgImage, is24Hour, volume,
    initialized: settingsInitialized,
    loading: settingsLoading
  } = useSelector(state => state.settings);

  const tasksInitialized = useSelector(state => state.tasks.initialized);
  const { user, token, loginAsGuest, loading: authLoading } = useAuth();
  const { pipWindow, togglePip } = usePip();

  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('dw-intro-seen'));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const authAttempted = useRef(false);

  useEffect(() => {
    if (user) {
      if (!settingsInitialized && !settingsLoading) dispatch(fetchSettingsRequest());
      if (!tasksInitialized) dispatch(fetchTasksRequest());
    }
  }, [dispatch, user, settingsInitialized, settingsLoading, tasksInitialized]);

  const timer = useTimer('work', timerSettings, autoStart, longBreakInterval, volume);

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
    if (!authLoading && !user && !storedToken && !showIntro && !isMaintenance && !authAttempted.current) {
      authAttempted.current = true;
      loginAsGuest().catch(() => { });
    }
  }, [authLoading, user, showIntro, isMaintenance, loginAsGuest]);

  const handleIntroComplete = () => {
    sessionStorage.setItem('dw-intro-seen', 'true');
    setShowIntro(false);
    authAttempted.current = false;
  };

  const toggleMute = () => {
    dispatch({ type: 'settings/updateSettings', payload: { volume: volume === 0 ? 0.5 : 0 } });
  };

  const setVolumeHandler = (val) => {
    dispatch({ type: 'settings/updateSettings', payload: { volume: val } });
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else if (document.exitFullscreen) document.exitFullscreen();
  };

  if (authLoading && !user) return <div style={{ background: '#050505', width: '100%', height: '100vh' }} />;
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
                  setVolume={setVolumeHandler}
                  toggleMute={toggleMute}
                  setIsSettingsOpen={setIsSettingsOpen}
                  setIsSupportOpen={setIsSupportOpen}
                  toggleFullScreen={toggleFullScreen}
                //setIsAchievementsOpen={setIsAchievementsOpen}
                />

                {/* {isAchievementsOpen && (
                  <div className="modal-overlay" onClick={() => setIsAchievementsOpen(false)}>
                    <div onClick={e => e.stopPropagation()}>
                      <AchievementHub />
                    </div>
                  </div>
                )} */}
              </div>

              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
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