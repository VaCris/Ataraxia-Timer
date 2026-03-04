import React, { createContext, useContext, useState, useEffect } from 'react';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTrack, setCurrentTrack] = useState({
        name: 'Lofi Focus',
        url: 'https://stream.zeno.fm/0r0xa792kwzuv',
        type: 'station'
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <MusicContext.Provider value={{
            isModalOpen,
            openModal,
            closeModal,
            currentTrack,
            setCurrentTrack
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => useContext(MusicContext);