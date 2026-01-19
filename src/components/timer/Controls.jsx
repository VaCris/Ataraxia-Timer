import React from 'react';
import { Play, Pause, RotateCcw, Monitor, Maximize2 } from 'lucide-react';

const Controls = ({ isActive, onToggle, onReset, onPipToggle, isInPipMode }) => {

    if (isInPipMode) {
        return (
            <button
                onClick={onToggle}
                style={{
                    width: '18vmin',
                    height: '18vmin',
                    borderRadius: '50%',
                    border: 'none',
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'var(--primary-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    padding: 0
                }}
            >
                {isActive ?
                    <Pause size="50%" fill="white" /> :
                    <Play size="50%" fill="white" style={{ marginLeft: '10%' }} />
                }
            </button>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
                onClick={onPipToggle}
                className="control-btn-secondary"
                title="Picture in Picture"
            >
                <Monitor size={20} />
            </button>

            <button
                onClick={onToggle}
                className="control-btn-primary"
            >
                {isActive ?
                    <Pause size={32} fill="white" /> :
                    <Play size={32} fill="white" style={{ marginLeft: '4px' }} />
                }
            </button>

            <button
                onClick={onReset}
                className="control-btn-secondary"
                title="Reset Timer"
            >
                <RotateCcw size={20} />
            </button>

            <button
                className="control-btn-secondary"
                title="Fullscreen"
                style={{ opacity: 0.5, cursor: 'default' }}
            >
                <Maximize2 size={20} />
            </button>

            <style>{`
                .control-btn-primary {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: none;
                    background: var(--primary-color);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.1s ease, box-shadow 0.3s ease;
                    box-shadow: 0 0 30px var(--primary-glow);
                }
                .control-btn-primary:active {
                    transform: scale(0.95);
                }
                
                .control-btn-secondary {
                    width: 50px;
                    height: 50px;
                    border-radius: 18px;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: transparent;
                    color: var(--text-muted);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .control-btn-secondary:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                    border-color: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
};

export default Controls;