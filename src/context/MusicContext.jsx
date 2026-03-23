import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTrack, setCurrentTrack] = useState({
        name: 'Lofi Focus',
        url: 'https://stream.zeno.fm/0r0xa792kwzuv'
    });

    const audioRef = useRef(new Audio(currentTrack.url));

    useEffect(() => {
        audioRef.current.src = currentTrack.url;

        if (isPlaying) {
            audioRef.current.play().catch(() => {});
        }
    }, [currentTrack]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(prev => !prev);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const toggleMusic = () => setIsModalOpen(prev => !prev);

    return (
        <MusicContext.Provider value={{
            isModalOpen,
            toggleMusic,
            openModal,
            closeModal,
            isPlaying,
            togglePlay,
            currentTrack,
            setCurrentTrack
        }}>
            {children}
        </MusicContext.Provider>
    );
};
export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within MusicProvider');
    }

    return context;
};