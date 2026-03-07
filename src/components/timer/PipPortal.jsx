import React from 'react';
import { createPortal } from 'react-dom';
import { usePomodoro } from '@context/PomodoroContext';
import { useSelector } from 'react-redux';

const PipPortal = ({ pipWindow }) => {
    const { state } = usePomodoro();
    const accentColor = useSelector(state => state.settings.accentColor) || '#e11d48';
    const longBreakInterval = useSelector(state => state.settings.longBreakInterval) || 4;

    if (!pipWindow) return null;

    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const totalSeconds = (state.settings?.[state.mode] || 25) * 60;
    const progress = (state.timeLeft / totalSeconds) * 100;

    return createPortal(
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#050505',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            padding: '4vw',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <div style={{
                fontSize: '4.5vw',
                fontWeight: '900',
                letterSpacing: '0.5em',
                color: accentColor,
                marginBottom: '1vh',
                textTransform: 'uppercase',
                fontStyle: 'italic',
                opacity: 0.9
            }}>
                {state.mode.replace('_', ' ')}
            </div>

            <div style={{
                fontSize: '3vw',
                fontWeight: '800',
                color: 'rgba(255,255,255,0.4)',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                marginBottom: '2vh',
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '0.5vh 3vw',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                Round {state.sessionsUntilLongBreak || 1} / {longBreakInterval}
            </div>

            <div style={{
                fontSize: '32vw',
                fontWeight: '900',
                letterSpacing: '-0.06em',
                lineHeight: '0.9',
                marginBottom: '3vh',
                fontVariantNumeric: 'tabular-nums',
                display: 'flex',
                alignItems: 'center',
                fontStyle: 'italic'
            }}>
                {String(minutes).padStart(2, '0')}
                <span style={{ 
                    color: accentColor, 
                    opacity: 0.8,
                    animation: state.isActive ? 'pulse 1s infinite' : 'none'
                }}>:</span>
                {String(seconds).padStart(2, '0')}
            </div>

            <div style={{
                width: '85%',
                height: '2.5vw',
                minHeight: '6px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '4vh',
                border: '1px solid rgba(255,255,255,0.03)'
            }}>
                <div style={{
                    height: '100%',
                    backgroundColor: accentColor,
                    width: `${progress}%`,
                    transition: 'width 1s linear',
                    boxShadow: `0 0 20px ${accentColor}`
                }} />
            </div>

            <div style={{
                fontSize: '2.5vw',
                fontWeight: '900',
                color: 'rgba(255,255,255,0.1)',
                letterSpacing: '0.8em',
                textTransform: 'uppercase',
                fontStyle: 'italic'
            }}>
                ATARAXIA V2
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>,
        pipWindow.document.body
    );
};

export default PipPortal;