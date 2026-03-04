import React from 'react';
import { createPortal } from 'react-dom';
import { usePomodoro } from '@context/PomodoroContext';

const PipPortal = ({ pipWindow }) => {
    const { state } = usePomodoro();

    if (!pipWindow) return null;

    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const totalSeconds = state.settings[state.mode] * 60;
    const progress = (state.timeLeft / totalSeconds) * 100;

    return createPortal(
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#050505',
            color: '#f5f5f7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            overflow: 'hidden',
            padding: '2vw'
        }}>
            <div style={{
                fontSize: '3vw',
                fontWeight: '900',
                letterSpacing: '0.4em',
                color: '#e11d48',
                marginBottom: '2vh',
                textTransform: 'uppercase',
                opacity: 0.8
            }}>
                {state.mode.replace('_', ' ')}
            </div>

            <div style={{
                fontSize: '22vw',
                fontWeight: '900',
                letterSpacing: '-0.05em',
                lineHeight: '1',
                marginBottom: '3vh',
                fontVariantNumeric: 'tabular-nums'
            }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div style={{
                width: '70%',
                height: '1.5vw',
                minHeight: '2px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '4vh'
            }}>
                <div style={{
                    height: '100%',
                    backgroundColor: '#e11d48',
                    width: `${progress}%`,
                    transition: 'width 1s linear',
                    boxShadow: '0 0 15px rgba(225, 29, 72, 0.4)'
                }} />
            </div>

            <div style={{
                fontSize: '2vw',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase'
            }}>
                Ataraxia v2
            </div>
        </div>,
        pipWindow.document.body
    );
};

export default PipPortal;