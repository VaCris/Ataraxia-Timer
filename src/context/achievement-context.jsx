import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { achievementsService } from '../api/achievements.service';
import { useAuth } from './auth-context';

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
            console.error("Error al cargar logros:", error);
            setAchievements([]);
        } finally {
            setLoading(false);
        }
    }, [token, user]);

    useEffect(() => {
        fetchAchievements();
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
        throw new Error("useAchievements debe usarse dentro de un AchievementProvider");
    }
    return context;
};