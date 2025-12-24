const TimerModes = ({ currentMode, setMode }) => {
    const modes = [
        { id: 'work', label: 'Deep Work' },
        { id: 'short', label: 'Short Break' },
        { id: 'long', label: 'Long Break' },
    ];

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '4px',
            borderRadius: '50px',
            display: 'inline-flex'
        }}>
            {modes.map((m) => (
                <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    style={{
                        background: currentMode === m.id ? 'var(--primary-color)' : 'transparent',
                        color: currentMode === m.id ? 'white' : 'var(--text-muted)',
                        border: 'none',
                        padding: '8px 24px',
                        borderRadius: '40px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    {m.label}
                </button>
            ))}
        </div>
    );
};

export default TimerModes;