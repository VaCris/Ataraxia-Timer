import React from 'react';
import TimerModes from './TimerModes';
import CircularDisplay from './CircularDisplay';
import Controls from './Controls';

const TimerWidget = ({
    mode, setMode, timeLeft,
    formatTime, isActive,
    cycles, longBreakInterval,
    toggleTimer, resetTimer,
    togglePip, isPipActive,
    isInPipMode
}) => {

    if (isInPipMode) {
        return (
            <section style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#000',
                userSelect: 'none'
            }}>
                <h1 style={{
                    color: 'white',
                    fontSize: '28vmin',
                    fontWeight: 'bold',
                    margin: 0,
                    fontVariantNumeric: 'tabular-nums'
                }}>
                    {formatTime(timeLeft)}
                </h1>

                <span style={{
                    color: mode === 'work' ? 'var(--primary-color)' : '#4ade80',
                    fontSize: '7vmin',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginTop: '1vh',
                    opacity: 0.9,
                    letterSpacing: '1px'
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

    const currentRound = (cycles % longBreakInterval) + 1;

    return (
        <section className="timer-section" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
            <div className={`timer-controls-fade ${isActive ? 'hidden' : ''}`} style={{ marginBottom: '1.5rem' }}>
                <TimerModes currentMode={mode} setMode={setMode} />
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularDisplay time={formatTime(timeLeft)} isActive={isActive} mode={mode} />

                {mode === 'work' && (
                    <div className="round-indicator" style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        marginTop: '1.5rem',
                        letterSpacing: '2px',
                        textTransform: 'uppercase'
                    }}>
                        Round {currentRound} / {longBreakInterval}
                    </div>
                )}
            </div>

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