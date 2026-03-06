import React from 'react';
import { createPortal } from 'react-dom';
import { usePomodoro } from '@context/PomodoroContext';

const PipPortal = ({ pipContainer, accentColor, accentRgb }) => {
    const { state } = usePomodoro();

    if (!pipContainer) return null;

    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    
    // Cálculo del progreso para la barra
    const totalSeconds = (state.settings?.[state.mode] || 25) * 60;
    const progress = (state.timeLeft / totalSeconds) * 100;

    return createPortal(
        <div style={{
            width: '100%',
            height: '100vh',
            backgroundColor: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontFamily: 'sans-serif',
            // Inyectamos las variables de color para que funcionen las clases accent
            '--color-accent': accentColor || '#e11d48',
            '--color-accent-rgb': accentRgb
        }}>
            {/* Modo actual (Focus/Break) */}
            <div className="mb-2 font-bold text-[5vw] text-white/30 uppercase tracking-[0.4em]">
                {state.mode.replace('_', ' ')}
            </div>

            {/* Tiempo Gigante */}
            <div className="font-black text-[30vw] text-cream tracking-tighter" style={{ lineHeight: 0.9 }}>
                {String(minutes).padStart(2, '0')}
                <span className="text-accent">:</span>
                {String(seconds).padStart(2, '0')}
            </div>

            {/* Barra de Progreso Inferior */}
            <div style={{
                width: '60%',
                height: '1vw',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '999px',
                marginTop: '5vh',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--color-accent)',
                    transition: 'width 1s linear'
                }} />
            </div>
        </div>,
        pipContainer
    );
};

export default PipPortal;