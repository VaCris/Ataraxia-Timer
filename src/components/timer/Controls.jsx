import { useState } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, PictureInPicture2 } from 'lucide-react';

const Controls = ({ isActive, onToggle, onReset, onPipToggle, isPipActive }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
                onClick={onPipToggle}
                style={{
                    width: '45px', height: '45px',
                    borderRadius: '50%',
                    background: isPipActive ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: isPipActive ? 'white' : 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}
                title="Abrir ventana flotante"
            >
                <PictureInPicture2 size={18} />
            </button>

            <button
                onClick={onToggle}
                style={{
                    width: '75px', height: '75px',
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
                {isActive ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" style={{ marginLeft: '4px' }} />}
            </button>

            <button
                onClick={onReset}
                style={{
                    width: '45px', height: '45px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <RotateCcw size={18} />
            </button>

            <button
                onClick={toggleFullscreen}
                style={{
                    width: '45px', height: '45px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Pantalla Completa"
            >
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>

        </div>
    );
};

export default Controls;