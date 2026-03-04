import React, { createContext, useContext, useState, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const [masterVolume, setMasterVolume] = useState(() => {
        return parseFloat(localStorage.getItem('ataraxia-master-volume') || '0.5');
    });

    const [alarmVolume, setAlarmVolume] = useState(() => {
        const saved = localStorage.getItem('ataraxia-alarm-volume');
        return saved !== null ? parseFloat(saved) : 0.8;
    });

    useEffect(() => {
        localStorage.setItem('ataraxia-master-volume', masterVolume.toString());
        localStorage.setItem('ataraxia-alarm-volume', alarmVolume.toString());
    }, [masterVolume, alarmVolume]);

    return (
        <AudioContext.Provider value={{ 
            masterVolume, 
            setMasterVolume, 
            alarmVolume, 
            setAlarmVolume 
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) return { masterVolume: 0.5, setMasterVolume: () => {}, alarmVolume: 0.8, setAlarmVolume: () => {} };
    return context;
};