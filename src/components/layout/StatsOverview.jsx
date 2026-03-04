import React from 'react';
import { usePomodoro } from '../../context/PomodoroContext';
import { Flame, CheckCircle, Trophy } from 'lucide-react';

const StatsOverview = () => {
    const { state } = usePomodoro();

    const stats = [
        //{ label: 'Current Streak', value: state.stats.streak, icon: Flame, color: 'text-orange-500' },
        //{ label: 'Sessions', value: state.stats.sessionsCompleted, icon: Trophy, color: 'text-accent' },
        //{ label: 'Tasks Done', value: state.stats.tasksCompleted || 0, icon: CheckCircle, color: 'text-blue-500' },
    ];

    return (
        <div className="gap-4 grid grid-cols-3 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-surface/50 backdrop-blur-sm p-4 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-black/40 ${stat.color}`}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <p className="font-bold text-[10px] text-white/30 uppercase tracking-widest">{stat.label}</p>
                            <p className="font-bold text-xl">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;