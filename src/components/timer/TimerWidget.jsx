import React from 'react';
import TimerModes from './TimerModes';
import CircularDisplay from './CircularDisplay';
import Controls from './Controls';

const TimerWidget = ({
    mode, setMode,timeLeft,
    formatTime, isActive,
    cycles, longBreakInterval,
    toggleTimer, resetTimer,
    togglePip, isPipActive,
    isInPipMode
}) => {

    const currentRound = cycles % longBreakInterval === 0 ? longBreakInterval : cycles % longBreakInterval;

    if (isInPipMode) {
        return (
            <section style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#000',
                cursor: 'default',
                userSelect: 'none'
            }}>
                <h1 style={{
                    color: 'white',
                    fontSize: '28vmin',
                    fontWeight: 'bold',
                    margin: 0,
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                    textShadow: '0 0 20px rgba(0,0,0,0.5)'
                }}>
                    {formatTime()}
                </h1>

                <span style={{
                    color: mode === 'work' ? 'var(--primary-color)' : '#4ade80',
                    fontSize: '7vmin',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginTop: '1vh',
                    opacity: 0.8
                }}>
                    {isActive ? (mode === 'work' ? 'Focus' : 'Break') : 'Paused'}
                </span>

                <div style={{ marginTop: '5vmin', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Controls
                        isActive={isActive}
                        onToggle={toggleTimer}
                        isInPipMode={true}
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="timer-section">
            <div className={`timer-controls-fade ${isActive ? 'hidden' : ''}`} style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <TimerModes currentMode={mode} setMode={setMode} />
            </div>

            <CircularDisplay time={formatTime(timeLeft)} isActive={isActive} mode={mode} />

            {mode === 'work' && (
                <div style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    marginTop: '-1.5rem',
                    marginBottom: '2.5rem',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    paddingTop: '1rem'
                }}>
                    ROUND {currentRound} / {longBreakInterval}
                </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Controls
                    isActive={isActive}
                    onToggle={toggleTimer}
                    onReset={resetTimer}
                    onPipToggle={togglePip}
                    isPipActive={isPipActive}
                    isInPipMode={false}
                />
            </div>
        </section>
    );
};

export default TimerWidget;