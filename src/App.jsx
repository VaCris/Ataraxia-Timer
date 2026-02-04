import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Settings, Volume2, VolumeX, Maximize, HelpCircle, Trophy } from 'lucide-react';

import { useTimer } from './hooks/useTimer';
import useLocalStorage from './hooks/useLocalStorage';
import { usePip } from './hooks/usePip';
import { useAuth } from './context/auth-context';
import { settingsService } from './api/settings.service';
import { tagsService } from './api/tags.service';
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
import MusicIndicator from './components/layout/MusicIndicator';
import AchievementHub from './components/achievements/AchievementHub';
import MaintenancePage from './components/layout/MaintenancePage';

import './styles/global.css';

function App() {
  const { user, token, loginAsGuest, loading } = useAuth();
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

  const { mode, setMode, timeLeft, formatTime, isActive, toggleTimer, resetTimer, cycles } = useTimer(
    'work', timerSettings, autoStart, longBreakInterval, volume
  );

  useEffect(() => {
    const handleMaintenance = () => {
      setIsMaintenance(true);
      if (window.location.pathname !== '/maintenance') {
        navigate('/maintenance');
      }
    };

    window.addEventListener('server:down', handleMaintenance);
    return () => window.removeEventListener('server:down', handleMaintenance);
  }, [navigate]);

  useEffect(() => {
    if (!user || !token || isMaintenance) return;

    const syncSettings = async () => {
      try {
        const cloudSettings = await settingsService.getSettings();

        if (cloudSettings) {
          if (cloudSettings.focusDuration) {
            setTimerSettings(prev => ({
              ...prev,
              work: cloudSettings.focusDuration,
              short: cloudSettings.shortBreakDuration || prev.short,
              long: cloudSettings.longBreakDuration || prev.long
            }));
          }

          if (cloudSettings.longBreakInterval) {
            setLongBreakInterval(cloudSettings.longBreakInterval);
          }

          const localAutoStart = localStorage.getItem('dw-autostart');

          if (cloudSettings.autoStartPomodoros !== undefined && localAutoStart === null) {
            setAutoStart(cloudSettings.autoStartPomodoros);
          }
        }

        const tags = await tagsService.getAll();
        const focusTag = tags.find(tag => tag.name === 'Focus');

        if (focusTag?.color) {
          setAccentColor(focusTag.color);
        }
      } catch { }
    };

    syncSettings();
  }, [user, token, isMaintenance]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!loading && !user && !storedToken && !showIntro && !isMaintenance) {
      loginAsGuest().catch(() => setIsMaintenance(true));
    }
  }, [loading, user, showIntro, isMaintenance]);

  const handleIntroComplete = async () => {
    sessionStorage.setItem('dw-intro-seen', 'true');
    setShowIntro(false);
    if (!user && !isMaintenance) await loginAsGuest().catch(() => setIsMaintenance(true));
  };

  const toggleMute = () => setVolume(volume === 0 ? 0.5 : 0);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  if (loading) return <div style={{ background: '#050505', width: '100%', height: '100vh' }} />;

  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <AchievementProvider>
      <MusicProvider>
        <Routes>
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/callback" element={<SpotifyCallback />} />
          <Route path="/achievements" element={<AchievementHub />} />
          <Route path="/*" element={
            <div style={{
              width: '100%',
              '--primary-color': accentColor,
              '--primary-glow': `${accentColor}80`
            }}>
              <div className="background-layer" style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }} />
              <div className="background-overlay" />

              {showIntro && <IntroScreen onComplete={handleIntroComplete} is24Hour={is24Hour} />}

              {pipWindow && createPortal(
                <div className="pip-container" style={{
                  width: '100%', height: '100vh',
                  backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                  backgroundColor: '#050505',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 0 }} />
                  <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <TimerWidget
                      mode={mode} setMode={setMode} timeLeft={timeLeft}
                      formatTime={formatTime} isActive={isActive}
                      cycles={cycles} longBreakInterval={longBreakInterval}
                      toggleTimer={toggleTimer} resetTimer={resetTimer}
                      timerSettings={timerSettings}
                      togglePip={togglePip} isPipActive={true} isInPipMode={true}
                    />
                  </div>
                </div>,
                pipWindow.document.body
              )}

              <MusicWidget />

              <div className="app-wrapper">
                <div className={`header-container ${isActive ? 'hidden' : ''}`}>
                  <Header is24Hour={is24Hour} />
                </div>

                <main className="main-layout">
                  <div style={{
                    width: '100%', display: 'flex', justifyContent: 'center',
                    opacity: pipWindow ? 0.3 : 1,
                    filter: pipWindow ? 'blur(2px) grayscale(100%)' : 'none',
                    transition: 'all 0.5s ease',
                    pointerEvents: pipWindow ? 'none' : 'auto'
                  }}>
                    <TimerWidget
                      mode={mode} setMode={setMode}
                      timeLeft={timeLeft} formatTime={formatTime}
                      cycles={cycles} longBreakInterval={longBreakInterval}
                      toggleTimer={toggleTimer} resetTimer={resetTimer}
                      togglePip={togglePip} isPipActive={!!pipWindow} isInPipMode={false}
                      isActive={isActive}
                      timerSettings={timerSettings}
                    />
                  </div>

                  <section className="tasks-section">
                    <MissionLog key={user?.id || 'guest'} showAd={!isActive} />
                  </section>
                </main>

                <div className={`dock-container dock-left ${isActive ? 'dock-hidden' : ''}`}>
                  <MusicIndicator />
                </div>

                <div className={`dock-container dock-right ${isActive ? 'dock-hidden' : ''}`}>
                  <div className="volume-wrapper">
                    <div className="volume-popup">
                      <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="vertical-slider"
                      />
                    </div>
                    <button onClick={toggleMute} className="dock-btn" title="Volume">
                      {volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                  </div>

                  <Link to="/achievements" className="dock-btn" title="Achievements">
                    <Trophy size={22} />
                  </Link>

                  <button onClick={() => setIsSettingsOpen(true)} className="dock-btn" title="Settings">
                    <Settings size={22} />
                  </button>

                  <button onClick={toggleFullScreen} className="dock-btn" title="Fullscreen">
                    <Maximize size={22} />
                  </button>

                  <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />

                  <button onClick={() => setIsSupportOpen(true)} className="dock-btn" title="Support">
                    <HelpCircle size={22} />
                  </button>
                </div>
              </div>

              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentBg={bgImage} onBgChange={setBgImage}
                accentColor={accentColor} onColorChange={setAccentColor}
                timerSettings={timerSettings} onTimerChange={setTimerSettings}
                autoStart={autoStart} onAutoStartChange={setAutoStart}
                longBreakInterval={longBreakInterval} onLongBreakIntervalChange={setLongBreakInterval}
                is24Hour={is24Hour} onFormatChange={setIs24Hour}
                volume={volume} onVolumeChange={setVolume}
              />

              <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
              />
            </div>
          } />
        </Routes>
      </MusicProvider>
    </AchievementProvider>
  );
}

export default App;