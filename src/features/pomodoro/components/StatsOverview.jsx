import React from 'react';
import { useStats } from '@/features/pomodoro/hooks/useStats';
import { TEXTS } from '@/shared/constants/texts.constants';

const StatsOverview = () => {
    const { stats, loading } = useStats();

    if (loading || !stats) {
        return <div className="bg-white/5 rounded-3xl h-24 animate-pulse" />;
    }

    return (
        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">{TEXTS.stats.currentLevel}</p>
                <p className="font-black text-accent text-2xl">{stats.level || 1}</p>
            </div>

            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">{TEXTS.stats.xp}</p>
                <p className="font-black text-2xl">{stats.xp || 0}</p>
            </div>

            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">{TEXTS.stats.focusStreak}</p>
                <p className="font-black text-orange-400 text-2xl">{stats.currentStreak || 0} 🔥</p>
            </div>

            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">{TEXTS.stats.totalPomodoros}</p>
                <p className="font-black text-blue-400 text-2xl">{stats.totalPomodoros || 0}</p>
            </div>
        </div>
    );
};

export default StatsOverview;