import { Play, Pause, RotateCcw } from 'lucide-react';

const Controls = ({ isActive, onToggle, onReset }) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <button
            onClick={onToggle}
            style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                background: 'var(--primary-color)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            {isActive ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" style={{ marginLeft: '4px' }} />}
        </button>

        <button
            onClick={onReset}
            style={{
                width: '50px', height: '50px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <RotateCcw size={20} />
        </button>
    </div>
);

export default Controls;