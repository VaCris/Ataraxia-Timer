import { useState, useEffect, useCallback } from 'react';
import { gamificationService } from '@api/gamification/gamification.service';
//import { CreateGetLeaderboardDto } from '@api/shared/dto/app.dto';
import toast from 'react-hot-toast';

export const useStats = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            
            const progData = await gamificationService.getProgress();
            setProgress(progData)
        } catch (error) {
            console.error("Error al cargar estadísticas", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return { progress, leaderboard: [], loading, refresh: loadData };
};