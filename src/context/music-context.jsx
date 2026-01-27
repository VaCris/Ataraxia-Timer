import React, { createContext, useContext, useState, useCallback } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [currentTrack, setCurrentTrack] = useState(null);
    const [playlistUrl, setPlaylistUrl] = useState('');

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);
    const toggleModal = useCallback(() => setIsModalOpen(prev => !prev), []);

    const updateTrackInfo = useCallback((info) => {
        setCurrentTrack(info);
    }, []);

    return (
        <MusicContext.Provider value={{
            isModalOpen, openModal, closeModal, toggleModal,
            currentTrack, updateTrackInfo,
            playlistUrl, setPlaylistUrl
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) throw new Error("useMusic must be used within a MusicProvider");
    return context;
};