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
            <button
                onClick={toggleModal}
                className={`dock-btn ${currentTrack?.isPlaying ? 'playing' : ''}`}
                title="Open Music Player"
            >
                <Music size={22} />
            </button>

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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MusicIndicator;