import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Gamepad2, BarChart2, Trophy, ChevronLeft } from 'lucide-react';

const ComingSoon = ({ onBack, type }) => {
    const content = {
        games: { icon: Gamepad2, title: 'Games Module' },
        stats: { icon: BarChart2, title: 'Advanced Insights' },
        achievements: { icon: Trophy, title: 'Achievement System' },
        default: { icon: Rocket, title: 'Something Big' }
    };

    const { icon: Icon, title } = content[type] || content.default;

    return (
        <div className="relative flex flex-col justify-center items-center bg-[#050505] w-screen h-screen overflow-hidden text-cream">
            <div className="top-0 left-0 absolute bg-[radial-gradient(circle_at_50%_50%,#e11d48_0%,transparent_50%)] opacity-20 w-full h-full pointer-events-none" />

            {onBack && (
                <button onClick={onBack} className="top-10 left-10 absolute flex items-center gap-2 font-black text-[10px] text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors">
                    <ChevronLeft size={16} /> Back to Terminal
                </button>
            )}

            <main className="z-10 flex flex-col items-center px-6 max-w-xl text-center">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="bg-white/5 shadow-glow mb-8 p-5 border border-white/10 rounded-full">
                    <Icon size={48} className="text-accent" />
                </motion.div>

                <h1 className="mb-4 font-black text-5xl md:text-7xl italic uppercase tracking-tighter">
                    {title} <span className="text-accent">is Coming</span>
                </h1>

                <p className="mb-10 font-bold text-white/40 text-xs md:text-sm uppercase tracking-[0.3em]">
                    Ataraxia V2
                </p>

                <div className="relative bg-white/5 rounded-full w-64 h-1 overflow-hidden">
                    <motion.div initial={{ width: "0%" }} animate={{ width: "75%" }} transition={{ duration: 2, ease: "easeOut" }} className="bg-accent shadow-glow h-full" />
                </div>
                <span className="mt-4 font-black text-[10px] text-accent uppercase tracking-widest animate-pulse">
                    System Loading: 75%
                </span>
            </main>
        </div>
    );
};

export default ComingSoon;