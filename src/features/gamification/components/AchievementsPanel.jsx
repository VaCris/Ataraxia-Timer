import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gamificationService } from '../api/gamification.api';
import { TEXTS } from '@/shared/constants/texts.constants';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const AchievementsPanel = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getAchievements()
      .then(data => setAchievements(data))
      .catch(err => console.error("Error fetching achievements:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full mt-6 sm:mt-10">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-widest text-white/90">{TEXTS.gamification.achievements}</h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          {achievements.map((achievement) => {
            const unlocked = achievement.progress >= achievement.threshold;
            return (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className={`relative overflow-hidden p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all ${
                  unlocked
                    ? 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    : 'bg-black/40 border-white/5 opacity-50 grayscale'
                }`}
              >
                {unlocked && (
                  <div 
                    className="absolute -top-10 -right-10 w-32 h-32 blur-3xl opacity-20 rounded-full"
                    style={{ backgroundColor: achievement.color || '#3b82f6' }}
                  />
                )}
                
                <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                  <div 
                    className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl shrink-0 flex justify-center items-center ${unlocked ? 'bg-black/40 shadow-inner' : 'bg-white/5'}`}
                    style={{ color: unlocked ? (achievement.color || '#3b82f6') : '#fff' }}
                  >
                    {achievement.iconUrl ? (
                      <img src={achievement.iconUrl} alt={achievement.name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 sm:w-12 sm:h-12">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base text-white font-bold tracking-wider truncate">{achievement.name}</h4>
                    <p className="text-white/50 text-[11px] sm:text-xs leading-relaxed line-clamp-2">{achievement.description}</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                            className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                            style={{ width: `${Math.min(100, (achievement.progress / achievement.threshold) * 100)}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-right text-white/40 mt-1">
                        {achievement.progress} / {achievement.threshold}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  );
};

export default AchievementsPanel;
