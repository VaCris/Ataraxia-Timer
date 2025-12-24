import { useState } from 'react';
import { useTimer } from './hooks/useTimer';
import { useLocalStorage } from './hooks/useLocalStorage';

import Header from './components/layout/Header';
import TimerModes from './components/timer/TimerModes';
import CircularDisplay from './components/timer/CircularDisplay';
import Controls from './components/timer/Controls';
import MissionLog from './components/tasks/MissionLog';
import SettingsModal from './components/layout/SettingsModal';

import './styles/global.css';

function App() {
  const [bgImage, setBgImage] = useLocalStorage('dw-background', '');
  const [accentColor, setAccentColor] = useLocalStorage('dw-color', '#8b5cf6');
  const [timerSettings, setTimerSettings] = useLocalStorage('dw-times', { work: 25, short: 5, long: 15 });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { mode, setMode, formatTime, isActive, toggleTimer, resetTimer } = useTimer('work', timerSettings);

  return (
    <div style={{ width: '100%', '--primary-color': accentColor, '--primary-glow': `${accentColor}80` }}>

      <div className="background-layer" style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }} />

      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: bgImage ? 'rgba(0,0,0,0.6)' : 'transparent',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <div className="app-wrapper">

        <div className={`header-container ${isActive ? 'hidden' : ''}`}>
          <Header onOpenSettings={() => setIsSettingsOpen(true)} />
        </div>

        <main className="main-layout">

          <section className="timer-section">

            <div className={`timer-controls-fade ${isActive ? 'hidden' : ''}`} style={{ marginBottom: '2rem' }}>
              <TimerModes currentMode={mode} setMode={setMode} />
            </div>

            <CircularDisplay time={formatTime()} isActive={isActive} />

            <div style={{ marginTop: '2rem' }}>
              <Controls isActive={isActive} onToggle={toggleTimer} onReset={resetTimer} />
            </div>

          </section>

          <section className="tasks-section">
            <MissionLog />
          </section>

        </main>
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
      />
    </div>
  );
}

export default App;