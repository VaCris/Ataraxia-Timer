import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, CloudRain, Coffee, Trees, Trash2, Radio, Upload, Play, Pause, Music } from 'lucide-react';
import { useMusic } from '@context/MusicContext';
import { useAudio } from '@context/AudioContext';

const RADIO_STATIONS = [
    { id: 'lofi', name: 'Lofi Hip Hop', url: 'https://stream.zeno.fm/0r0xa792kwzuv' },
    { id: 'jazz', name: 'Coffee Shop Jazz', url: 'https://cafe-de-paris.stream.publicradio.pro/cafe-de-paris' },
    { id: 'synth', name: 'Synthwave Relax', url: 'https://nightride.fm/stream/nightride.mp3' },
];

const AMBIENT_SOUNDS = [
    { id: 'rain', name: 'Rain', icon: <CloudRain size={20} />, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'cafe', name: 'Café', icon: <Coffee size={20} />, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'forest', name: 'Forest', icon: <Trees size={20} />, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

const MusicWidget = () => {
    const { isModalOpen: isOpen, closeModal: onClose, currentTrack, setCurrentTrack } = useMusic();
    const { masterVolume, setMasterVolume } = useAudio();
    const [activeTab, setActiveTab] = useState('radio');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playingAmbience, setPlayingAmbience] = useState(null);
    const [localFile, setLocalFile] = useState(null);

    const mainAudioRef = useRef(new Audio());
    const ambienceAudioRef = useRef(new Audio());

    useEffect(() => {
        mainAudioRef.current.volume = masterVolume;
        ambienceAudioRef.current.volume = masterVolume;
    }, [masterVolume]);

    const toggleMainMusic = (track) => {
        if (currentTrack?.url === track.url && isPlaying) {
            mainAudioRef.current.pause();
            setIsPlaying(false);
        } else {
            mainAudioRef.current.src = track.url;
            mainAudioRef.current.play();
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const newTrack = { name: file.name, url, type: 'local' };
            setLocalFile(newTrack);
            toggleMainMusic(newTrack);
        }
    };

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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bottom-24 left-28 z-50 fixed"
                >
                    <div className="flex flex-col bg-black/90 shadow-2xl backdrop-blur-3xl border border-white/10 rounded-[2.5rem] w-[450px] h-[500px] overflow-hidden glass">

                        <div className="flex justify-between items-center p-6 border-white/5 border-b">
                            <div className="flex gap-6">
                                {['radio', 'local', 'atmosphere'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? 'text-accent' : 'text-white/30 hover:text-white'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button onClick={onClose} className="p-2 text-white/20 hover:text-white"><X size={18} /></button>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                            {activeTab === 'radio' && (
                                <div className="space-y-3">
                                    {RADIO_STATIONS.map((station) => (
                                        <button
                                            key={station.id}
                                            onClick={() => toggleMainMusic(station)}
                                            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${currentTrack?.url === station.url && isPlaying ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Radio size={18} />
                                                <span className="font-bold text-xs uppercase tracking-widest">{station.name}</span>
                                            </div>
                                            {currentTrack?.url === station.url && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'local' && (
                                <div className="space-y-6">
                                    <label className="flex flex-col justify-center items-center gap-4 hover:bg-white/5 border-2 border-white/5 border-dashed rounded-[2rem] h-40 transition-all cursor-pointer">
                                        <Upload size={24} className="text-white/20" />
                                        <span className="px-10 font-black text-[10px] text-white/30 text-center uppercase tracking-widest">Upload MP3 from device</span>
                                        <input type="file" accept="audio/*" onChange={handleFileUpload} hidden />
                                    </label>

                                    {localFile && (
                                        <div className="flex justify-between items-center bg-accent/10 p-5 border border-accent/20 rounded-2xl">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <Music size={18} className="text-accent" />
                                                <span className="font-bold text-[10px] text-accent truncate uppercase">{localFile.name}</span>
                                            </div>
                                            <button onClick={() => toggleMainMusic(localFile)} className="text-accent">
                                                {isPlaying && currentTrack.type === 'local' ? <Pause size={16} /> : <Play size={16} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'atmosphere' && (
                                <div className="gap-4 grid grid-cols-3">
                                    {AMBIENT_SOUNDS.map((sound) => (
                                        <button
                                            key={sound.id}
                                            onClick={() => toggleAmbience(sound)}
                                            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all ${playingAmbience?.id === sound.id ? 'bg-accent/20 border-accent text-accent shadow-glow' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10'}`}
                                        >
                                            <div className="mb-3">{sound.icon}</div>
                                            <span className="font-black text-[9px] uppercase tracking-widest">{sound.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 p-8 border-white/5 border-t">
                            <div className="flex items-center gap-6">
                                <Volume2 size={18} className="text-white/20" />
                                <div className="group relative flex-1 bg-white/10 rounded-full h-1.5">
                                    <input
                                        type="range" min="0" max="1" step="0.01" value={masterVolume}
                                        onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                        className="z-10 absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    />
                                    <div className="top-0 left-0 absolute bg-accent shadow-glow rounded-full h-full transition-all" style={{ width: `${masterVolume * 100}%` }} />
                                    <div className="top-1/2 absolute bg-white opacity-0 group-hover:opacity-100 shadow-xl rounded-full w-4 h-4 transition-opacity -translate-y-1/2" style={{ left: `calc(${masterVolume * 100}% - 8px)` }} />
                                </div>
                                <span className="w-8 font-black text-[10px] text-white/20">{Math.round(masterVolume * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MusicWidget;