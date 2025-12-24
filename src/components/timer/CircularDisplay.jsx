const CircularDisplay = ({ time, isActive }) => (
    <div style={{
        width: '320px', height: '320px',
        borderRadius: '50%',
        border: '8px solid rgba(255,255,255,0.03)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        boxShadow: isActive ? '0 0 60px var(--primary-glow)' : 'none',
        transition: 'box-shadow 0.5s ease',
        margin: '0 auto 3rem auto'
    }}>
        <span style={{ fontSize: '5.5rem', fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {time}
        </span>
        <span style={{
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            marginTop: '1rem',
            fontSize: '0.9rem'
        }}>
            {isActive ? 'Focusing' : 'Ready'}
        </span>
    </div>
);

export default CircularDisplay;