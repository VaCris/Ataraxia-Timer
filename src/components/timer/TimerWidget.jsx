import React from 'react';
import TimerModes from './TimerModes';
import CircularDisplay from './CircularDisplay';
import Controls from './Controls';

const TimerWidget = ({
    mode, setMode,
    formatTime, isActive,
    cycles, longBreakInterval,
    toggleTimer, resetTimer,
    togglePip, isPipActive,
    isInPipMode
}) => {

    const currentRound = cycles % longBreakInterval === 0 ? longBreakInterval : cycles % longBreakInterval;

    return (
        <section className="timer-section" style={{ transform: isInPipMode ? 'scale(0.9)' : 'none' }}>

            {!isInPipMode && (
                <div className={`timer-controls-fade ${isActive ? 'hidden' : ''}`} style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <TimerModes currentMode={mode} setMode={setMode} />
                </div>
            )}

            <CircularDisplay time={formatTime()} isActive={isActive} mode={mode} />

            {mode === 'work' && (
                <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    marginTop: isInPipMode ? '0rem' : '-1.5rem',
                    marginBottom: '2.5rem',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    paddingTop: '1rem'
                }}>
                    ROUND {currentRound} / {longBreakInterval}
                </div>
            )}

            <div style={{ marginTop: mode === 'work' ? '0' : '2rem', display: 'flex', justifyContent: 'center' }}>
                <Controls
                    isActive={isActive}
                    onToggle={toggleTimer}
                    onReset={resetTimer}
                    onPipToggle={togglePip}
                    isPipActive={isPipActive}
                />
            </div>
        </section>
    );
};

export default TimerWidget;