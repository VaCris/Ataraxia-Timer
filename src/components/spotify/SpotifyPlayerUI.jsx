import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const SpotifyPlayerUI = ({ currentTrack, isPaused, togglePlay, volume, setVolume }) => {
    const track = currentTrack || {
        name: "No track playing",
        artists: [{ name: "Open Spotify to start" }],
        album: { images: [{ url: "https://via.placeholder.com/150" }] }
    };

    return (
        <div className="space-y-5 w-full">
            {/* Info de la canción */}
            <div className="flex items-center gap-4">
                <div className="shadow-lg border border-white/10 rounded-xl w-14 h-14 overflow-hidden shrink-0">
                    <img src={track.album?.images[0]?.url} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-black text-white text-xs truncate uppercase tracking-tight">
                        {track.name}
                    </h4>
                    <p className="mt-0.5 font-bold text-[10px] text-accent truncate uppercase tracking-widest">
                        {track.artists[0].name}
                    </p>
                </div>
            </div>

            {/* Controles Principales */}
            <div className="flex justify-center items-center gap-8">
                <button className="text-white/20 hover:text-white transition-colors">
                    <SkipBack size={20} fill="currentColor" />
                </button>

                <button
                    onClick={togglePlay}
                    className="flex justify-center items-center bg-white shadow-glow-white rounded-full w-12 h-12 text-black hover:scale-110 active:scale-95 transition-all"
                >
                    {isPaused ? <Play size={20} fill="black" className="ml-1" /> : <Pause size={20} fill="black" />}
                </button>

                <button className="text-white/20 hover:text-white transition-colors">
                    <SkipForward size={20} fill="currentColor" />
                </button>
            </div>

            {/* Volumen Sutil */}
            <div className="group flex items-center gap-3 px-2">
                <Volume2 size={12} className="text-white/20 group-hover:text-accent transition-colors" />
                <input
                    type="range"
                    min="0" max="100"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="flex-1 bg-white/5 rounded-full h-1 accent-accent appearance-none cursor-pointer"
                />
            </div>
        </div>
    );
};

export default SpotifyPlayerUI;