import React from 'react';
import { useMusic } from '../../context/music-context';
import { Music } from 'lucide-react';

const MusicIndicator = () => {
    const { isModalOpen, toggleModal, currentTrack } = useMusic();

    if (isModalOpen) return null;

    const trackText = currentTrack
        ? `${currentTrack.title}  •  ${currentTrack.artist}`
        : '';

    return (
        <div className="music-indicator-wrapper">
            {currentTrack && (
                <div
                    onClick={toggleModal}
                    className="track-floating-label"
                    title={trackText}
                >
                    <div className="equalizer-icon">
                        <div className={`bar ${currentTrack.isPlaying ? 'animating' : ''}`}></div>
                        <div className={`bar ${currentTrack.isPlaying ? 'animating' : ''}`}></div>
                        <div className={`bar ${currentTrack.isPlaying ? 'animating' : ''}`}></div>
                    </div>

                    <div className="text-scroll-mask">
                        <div className="text-scroll-inner">
                            <span>{trackText}</span>
                            <span className="separator">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{trackText}</span>
                            <span className="separator">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={toggleModal}
                className={`dock-btn ${currentTrack?.isPlaying ? 'playing' : ''}`}
                title="Open Music Player"
            >
                <Music size={22} />
            </button>

            <style>{`
                .music-indicator-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    overflow: visible !important;
                }

                .track-floating-label {
                    position: absolute;
                    left: 55px;
                    top: 50%;
                    transform: translateY(-50%);

                    background: rgba(10, 10, 10, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0 14px;
                    height: 36px;
                    border-radius: 18px;
                    color: white;
                    font-size: 0.85rem;

                    display: flex;
                    align-items: center;
                    gap: 12px;

                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                    transition: all 0.2s ease;

                    width: 200px;
                    z-index: 99999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .track-floating-label:hover { background: rgba(0, 0, 0, 0.8); }

                .text-scroll-mask {
                    flex: 1;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
                }

                .text-scroll-inner {
                    display: flex;
                    white-space: nowrap;
                    align-items: center;
                    animation: scroll-left 12s linear infinite;
                }

                .track-floating-label:hover .text-scroll-inner {
                    animation-play-state: paused;
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @keyframes slideIn { 
                    from { opacity: 0; transform: translateY(-50%) translateX(-10px); } 
                    to { opacity: 1; transform: translateY(-50%) translateX(0); } 
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

                .equalizer-icon { display: flex; gap: 2px; align-items: flex-end; height: 12px; flex-shrink: 0; }
                .bar { width: 2px; background: #1db954; height: 3px; border-radius: 1px; }
                
                .bar.animating { animation: equalizer 0.8s infinite ease-in-out; }
                .bar.animating:nth-child(1) { animation-delay: 0s; }
                .bar.animating:nth-child(2) { animation-delay: 0.15s; }
                .bar.animating:nth-child(3) { animation-delay: 0.3s; }
                
                @keyframes equalizer { 0% { height: 3px; } 55% { height: 12px; } 100% { height: 3px; } }
                
                .dock-btn.playing { 
                    color: #1db954; 
                    background: rgba(29, 185, 84, 0.1);
                    border: 1px solid rgba(29, 185, 84, 0.3);
                }
            `}</style>
        </div>
    );
};

export default MusicIndicator;