import React from 'react';
import { useStats } from '@hooks/useStats';

const StatsOverview = () => {
    const { progress, loading } = useStats();

    if (loading || !progress) {
        return <div className="bg-white/5 rounded-3xl h-24 animate-pulse" />;
    }

    return (
        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">Nivel Actual</p>
                <p className="font-black text-accent text-2xl">{progress.level || 1}</p>
            </div>
            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">Experiencia (XP)</p>
                <p className="font-black text-2xl">{progress.xp || 0}</p>
            </div>
            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">Racha de Enfoque</p>
                <p className="font-black text-orange-400 text-2xl">{progress.currentStreak || 0} 🔥</p>
            </div>
            <div className="p-4 border border-white/5 rounded-3xl glass">
                <p className="font-bold text-[10px] text-white/40 uppercase">Total Pomodoros</p>
                <p className="font-black text-blue-400 text-2xl">{progress.totalPomodoros || 0}</p>
            </div>
        </div>
    );
};

export default StatsOverview;