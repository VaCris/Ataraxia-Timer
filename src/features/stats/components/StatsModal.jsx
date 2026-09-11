import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Target, Zap, CheckCircle2, Lock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { TEXTS } from '@/shared/constants/texts.constants';
import { gamificationService } from '../../gamification/api/gamification.api';

const StatCard = ({ icon, label, value, sublabel }) => (
    <div className="group bg-black/40 backdrop-blur-2xl p-8 border border-white/5 hover:border-white/10 rounded-[2.5rem] transition-all glass">
        <div className="flex justify-between items-start mb-4">
            <div className="bg-white/5 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <CheckCircle2 size={16} className="text-white/10" />
        </div>
        <div className="space-y-1">
            <p className="font-black text-[10px] text-white/20 uppercase tracking-[0.2em]">{label}</p>
            <h3 className="font-black text-white text-3xl">{value}</h3>
            <p className="font-bold text-[9px] text-white/40 uppercase tracking-widest">{sublabel}</p>
        </div>
    </div>
);

const StatsModal = ({ isOpen, onClose }) => {
    const user = useSelector((state) => state.auth.user);
    const [stats, setStats] = React.useState(null);
    const loading = Boolean(isOpen && user && stats === null);

    React.useEffect(() => {
        if (!isOpen || !user) return undefined;

        let active = true;

        gamificationService.getStats()
            .then((data) => {
                if (active) setStats(data);
            })
            .catch((err) => console.error('Error fetching stats:', err));

        return () => {
            active = false;
        };
    }, [isOpen, user]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="z-[200] fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative flex flex-col bg-black/80 backdrop-blur-3xl shadow-2xl border border-white/10 mx-auto rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden"
                        style={{
                            boxShadow: '0 0 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
                        }}
                    >
                        <div className="absolute top-8 right-8 z-50 flex gap-3">
                            <button
                                onClick={onClose}
                                className="bg-white/5 hover:bg-white/10 p-3 rounded-full text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 md:p-12 custom-scrollbar">
                            <h2 className="font-display font-black text-4xl text-white mb-8 tracking-tight">
                                {TEXTS.stats.insights}
                            </h2>

                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                                </div>
                            ) : !user ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Lock size={48} className="text-white/20 mb-4 mx-auto" />
                                    <h3 className="text-white font-bold text-xl mb-2">{TEXTS.auth.loginRequired}</h3>
                                    <p className="text-white/50 text-sm">{TEXTS.stats.loginToView}</p>
                                </div>
                            ) : (
                                <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                    <StatCard
                                        icon={<Target className="text-emerald-400" />}
                                        label={TEXTS.stats.pomodoros}
                                        value={stats?.pomodorosCompleted || 0}
                                        sublabel={TEXTS.stats.completed}
                                    />
                                    <StatCard
                                        icon={<Zap className="text-amber-400" />}
                                        label={TEXTS.stats.currentStreak}
                                        value={`${stats?.currentStreak || 0} ${TEXTS.stats.days}`}
                                        sublabel={`${TEXTS.stats.best}: ${stats?.longestStreak || 0} ${TEXTS.stats.days}`}
                                    />
                                    <StatCard
                                        icon={<Clock className="text-blue-400" />}
                                        label={TEXTS.stats.level}
                                        value={stats?.level || 1}
                                        sublabel={TEXTS.stats.currentRank}
                                    />
                                    <StatCard
                                        icon={<Target className="text-purple-400" />}
                                        label={TEXTS.stats.experience}
                                        value={stats?.experience || 0}
                                        sublabel={TEXTS.stats.totalXp}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StatsModal;
