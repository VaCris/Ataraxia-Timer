import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Medal, Lock } from 'lucide-react';
import { TEXTS } from '@/shared/constants/texts.constants';
import { useSelector } from 'react-redux';
import AchievementsPanel from './AchievementsPanel';
import LeaderboardPanel from './LeaderboardPanel';

const GamificationModal = ({ isOpen, onClose }) => {
    const user = useSelector((state) => state.auth.user);
    const [activeTab, setActiveTab] = React.useState('achievements');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="z-[200] fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
                >
                    <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative flex flex-col bg-black/80 backdrop-blur-3xl shadow-2xl border border-white/10 mx-auto rounded-2xl sm:rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden"
                style={{
                    boxShadow: '0 0 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
                }}
            >
                <div className="absolute top-3 right-3 sm:top-8 sm:right-8 z-50">
                    <button
                        onClick={onClose}
                        className="bg-white/5 hover:bg-white/10 p-2 sm:p-3 rounded-full text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 md:p-12 custom-scrollbar">
                    <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8">
                        <button
                            onClick={() => setActiveTab('achievements')}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm transition-all ${
                                activeTab === 'achievements' 
                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Trophy size={14} className="sm:w-4 sm:h-4" />
                            <span>{TEXTS.gamification.achievements}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm transition-all ${
                                activeTab === 'leaderboard' 
                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Medal size={14} className="sm:w-4 sm:h-4" />
                            <span>{TEXTS.gamification.leaderboard}</span>
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {!user ? (
                            <motion.div
                                key="unauth"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="flex flex-col items-center justify-center p-12 text-center"
                            >
                                <Lock size={48} className="text-white/20 mb-4 mx-auto" />
                                <h3 className="text-white font-bold text-xl mb-2">{TEXTS.auth.loginRequired}</h3>
                                <p className="text-white/50 text-sm">{TEXTS.stats.loginToView}</p>
                            </motion.div>
                        ) : activeTab === 'achievements' ? (
                            <motion.div
                                key="achievements"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AchievementsPanel />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="leaderboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <LeaderboardPanel />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GamificationModal;
