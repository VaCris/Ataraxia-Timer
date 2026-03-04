import { useState, useEffect } from 'react';
import { gamificationService } from '@api/gamification/gamification.service';
import { CreateGetLeaderboardDto } from '@api/shared/dto/app.dto';
import toast from 'react-hot-toast';

export const useStats = () => {
    const [progress, setProgress] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const [progData, leaderData] = await Promise.all([
                gamificationService.getProgress(),
                gamificationService.getLeaderboard(CreateGetLeaderboardDto(5))
            ]);
            setProgress(progData);
            setLeaderboard(leaderData);
        } catch (error) {
            toast.error("Error loading statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    return { progress, leaderboard, loading, refresh: loadData };
};