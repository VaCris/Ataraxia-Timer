import React from 'react';

const CircularDisplay = ({ time, isActive, mode }) => {
    const radius = 120;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    const getStatusText = () => {
        if (mode === 'short' || mode === 'long') {
            return 'BREAK';
        }
        return isActive ? 'FOCUSING' : 'READY';
    };

    return (
        <div style={{ position: 'relative', width: radius * 2, height: radius * 2, margin: '0 auto' }}>
            <svg height={radius * 2} width={radius * 2} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                <circle
                    stroke="rgba(255, 255, 255, 0.1)" strokeWidth={stroke} fill="transparent"
                    r={normalizedRadius} cx={radius} cy={radius}
                />
                <circle
                    stroke="var(--primary-color)" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: isActive ? 0 : circumference, transition: 'stroke-dashoffset 0.5s linear' }}
                    strokeLinecap="round" fill="transparent"
                    r={normalizedRadius} cx={radius} cy={radius}
                />
            </svg>

            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 700, margin: 0, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 20px var(--primary-glow)' }}>
                    {time}
                </h1>
                <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.7, marginTop: '0.5rem', fontWeight: 600 }}>
                    {getStatusText()}
                </p>
            </div>
        </div>
    );
};

export default CircularDisplay;