import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { usePomodoro } from '@context/PomodoroContext';
import {
    User,
    Mail,
    Trophy,
    Target,
    Clock,
    Zap,
    Save,
    Edit2,
    CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileView = () => {
    const user = useSelector((state) => state.auth.user);
    const authStatus = useSelector((state) => state.auth.status);

    const { state } = usePomodoro();

    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    const currentLevel = state.stats.level || 1;
    const currentXP = state.stats.xp || 0;
    const xpToNextLevel = 100;
    const progressPercentage = currentXP % xpToNextLevel;

    const displayName =
        user?.username ||
        user?.name ||
        user?.email?.split('@')[0] ||
        'Focus Member';

    const displayEmail = user?.email || 'no-email@ataraxia.app';

    const handleStartEdit = () => {
        setNewUsername(displayName);
        setIsEditing(true);
    };

    const handleUpdateProfile = () => {
        const cleanUsername = newUsername.trim();

        if (cleanUsername.length < 3) {
            toast.error('Username too short');
            return;
        }

        toast.success('Profile updated successfully');
        setIsEditing(false);
    };

    if (authStatus === 'loading') {
        return (
            <div className="flex justify-center items-center w-full min-h-[60vh]">
                <div className="font-black text-[10px] text-white/30 uppercase tracking-[0.3em]">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 mx-auto p-8 w-full max-w-5xl"
        >
            <div className="flex md:flex-row flex-col items-center gap-8 bg-black/40 backdrop-blur-3xl p-10 border border-white/5 rounded-[3rem] glass">
                <div className="relative">
                    <div className="flex justify-center items-center bg-accent/20 shadow-glow border-2 border-accent rounded-full w-32 h-32">
                        <User size={60} className="text-accent" />
                    </div>

                    <div className="-right-2 -bottom-2 absolute bg-accent shadow-lg p-2 rounded-xl text-white">
                        <Trophy size={20} />
                    </div>
                </div>

                <div className="flex-1 space-y-2 md:text-left text-center">
                    <div className="flex justify-center md:justify-start items-center gap-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="bg-white/5 px-4 py-1 border border-accent/50 rounded-xl outline-none font-black text-white text-2xl uppercase tracking-wider"
                                autoFocus
                            />
                        ) : (
                            <h2 className="font-black text-white text-3xl uppercase tracking-[0.1em]">
                                {displayName}
                            </h2>
                        )}

                        <button
                            type="button"
                            onClick={isEditing ? handleUpdateProfile : handleStartEdit}
                            className="p-2 text-white/20 hover:text-accent transition-colors"
                        >
                            {isEditing ? <Save size={20} /> : <Edit2 size={18} />}
                        </button>
                    </div>

                    <p className="flex justify-center md:justify-start items-center gap-2 font-bold text-white/40 text-xs uppercase tracking-[0.3em]">
                        <Mail size={14} />
                        {displayEmail}
                    </p>
                </div>

                <div className="bg-white/5 p-6 border border-white/5 rounded-[2rem] min-w-[200px]">
                    <div className="flex justify-between items-end mb-2">
                        <span className="font-black text-[10px] text-accent uppercase tracking-widest">
                            Level {currentLevel}
                        </span>

                        <span className="font-bold text-[10px] text-white/20 uppercase">
                            {currentXP} XP
                        </span>
                    </div>

                    <div className="bg-white/5 rounded-full w-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            className="bg-accent shadow-glow h-full transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                <StatCard
                    icon={<Clock className="text-blue-400" />}
                    label="Total Focus"
                    value={`${Math.floor(state.stats.totalMinutes || 0)}m`}
                    sublabel="Time in sanctuary"
                />

                <StatCard
                    icon={<Target className="text-emerald-400" />}
                    label="Sessions"
                    value={state.stats.completedSessions || 0}
                    sublabel="Tasks completed"
                />

                <StatCard
                    icon={<Zap className="text-amber-400" />}
                    label="Current Streak"
                    value="5 Days"
                    sublabel="Consistent focus"
                />
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, sublabel }) => (
    <div className="group bg-black/40 backdrop-blur-2xl p-8 border border-white/5 hover:border-white/10 rounded-[2.5rem] transition-all glass">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-white/5 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>

            <CheckCircle2 size={16} className="text-white/10" />
        </div>

        <div className="space-y-1">
            <p className="font-black text-[10px] text-white/20 uppercase tracking-[0.2em]">
                {label}
            </p>

            <h3 className="font-black text-white text-3xl">
                {value}
            </h3>

            <p className="font-bold text-[9px] text-white/40 uppercase tracking-widest">
                {sublabel}
            </p>
        </div>
    </div>
);

export default ProfileView;