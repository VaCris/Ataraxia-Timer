import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, CloudRain, Coffee, Trees, Waves, Maximize2 } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import { useAudio } from '../../context/AudioContext';

const AMBIENT_SOUNDS = [
    { id: 'rain', name: 'Rain', icon: <CloudRain size={18} />, url: 'https://www.soundjay.com/nature/rain-07.mp3' },
    { id: 'cafe', name: 'Cafe', icon: <Coffee size={18} />, url: 'https://codeskulptor-demos.commondatastorage.googleapis.com/descent/background%20music.mp3' },
    { id: 'forest', name: 'Forest', icon: <Trees size={18} />, url: 'https://www.soundjay.com/nature/forest-wind-01.mp3' },
    { id: 'waves', name: 'Ocean', icon: <Waves size={18} />, url: 'https://www.soundjay.com/nature/ocean-wave-1.mp3' },
];

const MusicWidget = () => {
    const { isModalOpen: isOpen, closeModal: onClose } = useMusic();
    const { masterVolume, setMasterVolume } = useAudio();
    const [playingAmbience, setPlayingAmbience] = useState(null);
    const ambienceAudioRef = useRef(new Audio());

    useEffect(() => {
        ambienceAudioRef.current.volume = masterVolume;
    }, [masterVolume]);

    const toggleAmbience = (sound) => {
        if (playingAmbience?.id === sound.id) {
            ambienceAudioRef.current.pause();
            setPlayingAmbience(null);
        } else {
            ambienceAudioRef.current.src = sound.url;
            ambienceAudioRef.current.loop = true;
            ambienceAudioRef.current.play();
            setPlayingAmbience(sound);
        }
    };

    return (
        <motion.div
            initial={false}
            animate={{
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.95,
                y: isOpen ? 0 : 40,
                pointerEvents: isOpen ? 'auto' : 'none',
                visibility: isOpen ? 'visible' : 'hidden'
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bottom-24 left-28 z-50 fixed"
        >
            <div className="flex flex-col bg-black/95 shadow-2xl backdrop-blur-3xl border border-white/10 rounded-[2.5rem] w-[550px] h-[600px] overflow-hidden glass">

                <div className="flex justify-between items-center p-6 border-white/5 border-b">
                    <span className="font-black text-[9px] text-white/20 uppercase tracking-[0.3em]">Lofi.cafe Player</span>
                    <div className="flex items-center gap-4">
                        <a href="https://www.lofi.cafe/" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors">
                            <Maximize2 size={16} />
                        </a>
                        <button onClick={onClose} className="text-white/20 hover:text-white"><X size={18} /></button>
                    </div>
                </div>

                <div className="relative flex-1 bg-black">
                    <iframe
                        src="https://www.lofi.cafe/"
                        className="border-none w-full h-full"
                        title="Lofi Cafe"
                        allow="autoplay; encrypted-media"
                    />
                    <div className="right-4 bottom-4 left-4 absolute pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md p-2 border border-white/5 rounded-xl font-bold text-[8px] text-white/40 text-center uppercase tracking-tighter">
                            Use ← → keys to change station | Space to Pause
                        </div>
                    </div>
                </div>

                <div className="space-y-6 bg-white/5 p-6 border-white/5 border-t">
                    {/* <div className="flex justify-between items-center gap-4">
                        {AMBIENT_SOUNDS.map((sound) => (
                            <button
                                key={sound.id}
                                onClick={() => toggleAmbience(sound)}
                                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-2xl border transition-all ${playingAmbience?.id === sound.id ? 'bg-accent/10 border-accent text-accent' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                            >
                                {sound.icon}
                            </button>
                        ))}
                    </div> */}

                    <div className="flex items-center gap-6">
                        {/* <Volume2 size={16} className="text-white/20" />
                        <div className="group relative flex-1 bg-white/10 rounded-full h-1">
                            <input
                                type="range" min="0" max="1" step="0.01" value={masterVolume}
                                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                className="z-10 absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                            <div className="top-0 left-0 absolute bg-accent rounded-full h-full transition-all" style={{ width: `${masterVolume * 100}%` }} />
                        </div> */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MusicWidget;