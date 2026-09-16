import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';
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
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const LeaderboardPanel = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getLeaderboard({ limit: 10 })
      .then(data => {
          if (Array.isArray(data)) {
              setLeaderboard(data);
          } else if (data && Array.isArray(data.items)) {
              setLeaderboard(data.items);
          } else {
              setLeaderboard([]);
          }
      })
      .catch(err => console.error("Error fetching leaderboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const getRankIcon = (index) => {
      switch (index) {
          case 0: return <Trophy className="text-yellow-400 w-6 h-6" />;
          case 1: return <Medal className="text-gray-300 w-6 h-6" />;
          case 2: return <Medal className="text-amber-600 w-6 h-6" />;
          default: return <Award className="text-white/20 w-6 h-6" />;
      }
  };

  return (
    <div className="w-full mt-6 sm:mt-10">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-widest text-white/90">{TEXTS.gamification.leaderboard}</h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-10 text-white/40 font-bold uppercase tracking-widest text-sm">
            {TEXTS.gamification.noRankings}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-2 sm:gap-3"
        >
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.id || index}
              variants={itemVariants}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-8 sm:w-10 flex justify-center items-center font-black text-lg sm:text-xl text-white/40 shrink-0">
                      {index < 3 ? getRankIcon(index) : `#${index + 1}`}
                  </div>
                  <div className="flex flex-col min-w-0">
                      <span className="font-bold text-white text-sm sm:text-lg truncate">{user.name || user.username || 'Anonymous'}</span>
                      <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider font-bold">Lvl {user.level || 1}</span>
                  </div>
              </div>
              <div className="flex flex-col items-end shrink-0 ml-3">
                  <span className="text-emerald-400 font-black text-base sm:text-xl">{user.experience || 0}</span>
                  <span className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest font-bold">XP</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LeaderboardPanel;
