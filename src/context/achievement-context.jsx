import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { achievementsService } from '../api/achievements.service';
import { useAuth } from './auth-context';
import toast from 'react-hot-toast';

const AchievementContext = createContext();

export const AchievementProvider = ({ children }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token, user } = useAuth();

    const fetchAchievements = useCallback(async () => {
        if (!token || (user && user.isGuest)) {
            setAchievements([]);
            return;
        }

        setLoading(true);
        try {
            const data = await achievementsService.getAchievements();
            setAchievements(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error({ error:"Error loading achievements"});
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchAchievements();
    }, []);

    useEffect(() => {
        const handleTimerComplete = () => {
            fetchAchievements();
            //toast.success('Nuevo Logro Desbloqueado')
        };

        window.addEventListener('timer:completed', handleTimerComplete);
        return () => window.removeEventListener('timer:completed', handleTimerComplete);
    }, [fetchAchievements]);

    return (
        <AchievementContext.Provider value={{
            achievements,
            loading,
            refreshAchievements: fetchAchievements
        }}>
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievements = () => {
    const context = useContext(AchievementContext);
    if (!context) {
        throw new Error("useAchievements must be used within an AchievementProvider");
    }
    return context;
};