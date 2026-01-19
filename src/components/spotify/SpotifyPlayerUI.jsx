import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music2 } from 'lucide-react';

const SpotifyPlayerUI = ({ currentTrack, isPaused, togglePlay, volume, setVolume }) => {
    const trackName = currentTrack?.name || "Ready to Play";
    const artistName = currentTrack?.artists?.map(a => a.name).join(', ') || "Select a song";
    const albumImage = currentTrack?.album?.images?.[0]?.url;

    return (
        <div className="spotify-player-ui">
            <div className="track-info">
                {albumImage ? (
                    <img src={albumImage} alt={trackName} className="album-art" />
                ) : (
                    <div className="album-art-placeholder">
                        <Music2 size={24} color="rgba(255,255,255,0.5)" />
                    </div>
                )}
                <div className="track-details">
                    <span className="track-name">{trackName}</span>
                    <span className="artist-name">{artistName}</span>
                </div>
            </div>

            <div className="player-controls">
                <button className="control-btn-sm"><SkipBack size={20} /></button>
                <button className="play-btn" onClick={togglePlay}>
                    {isPaused ? <Play size={24} fill="black" className="play-icon" /> : <Pause size={24} fill="black" className="play-icon" />}
                </button>
                <button className="control-btn-sm"><SkipForward size={20} /></button>
            </div>

            <div className="volume-controls">
                <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)} className="control-btn-sm">
                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                    style={{ backgroundSize: `${volume * 100}% 100%` }}
                />
            </div>

            <style>{`
                .spotify-player-ui {
                    display: flex; flex-direction: column; gap: 16px;
                    padding: 16px; background: rgba(0,0,0,0.3);
                    border-radius: 16px; border: 1px solid rgba(255,255,255,0.05);
                }
                .track-info { display: flex; align-items: center; gap: 12px; }
                .album-art { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; }
                .album-art-placeholder { 
                    width: 48px; height: 48px; border-radius: 8px; background: rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                }
                .track-details { display: flex; flex-direction: column; overflow: hidden; }
                .track-name { color: white; font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .artist-name { color: rgba(255,255,255,0.7); font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                
                .player-controls { display: flex; align-items: center; justify-content: center; gap: 16px; }
                .control-btn-sm { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; transition: color 0.2s; }
                .control-btn-sm:hover { color: white; }
                .play-btn {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: white; border: none; color: black;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: transform 0.2s;
                }
                .play-btn:hover { transform: scale(1.05); }
                .play-icon { position: relative; left: 1px; }

                .volume-controls { display: flex; align-items: center; gap: 8px; }
                .volume-slider {
                    flex: 1; -webkit-appearance: none; height: 4px; border-radius: 2px;
                    background: rgba(255,255,255,0.1); outline: none;
                    background-image: linear-gradient(#1db954, #1db954);
                    background-repeat: no-repeat; cursor: pointer;
                }
                .volume-slider::-webkit-slider-thumb {
                    -webkit-appearance: none; width: 12px; height: 12px;
                    background: white; border-radius: 50%; cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    );
};

export default SpotifyPlayerUI;