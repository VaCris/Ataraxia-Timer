import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

const Restricted = () => {
    return (
        <div className="relative flex flex-col justify-center items-center bg-[#080808] w-screen h-screen overflow-hidden text-cream">
            {/* Grid overlay aesthetic */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <main className="z-10 flex flex-col items-center bg-black/60 p-12 border border-red-500/20 rounded-[3rem] text-center glass">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-6 text-red-500"
                >
                    <ShieldCheck size={80} strokeWidth={1} />
                </motion.div>

                <h2 className="mb-2 font-black text-red-500 text-3xl italic uppercase tracking-tight">
                    Restricted Access
                </h2>
                <div className="bg-red-500/50 mb-6 w-12 h-[2px]" />

                <p className="max-w-xs text-white/40 text-xs uppercase leading-loose tracking-widest">
                    Your current credentials or location are not authorized to access this terminal.
                </p>

                <div className="flex items-center gap-2 bg-red-500/10 mt-8 px-4 py-2 border border-red-500/20 rounded-lg">
                    <Lock size={14} className="text-red-500" />
                    <span className="font-bold text-[10px] text-red-500 uppercase tracking-tighter">Protocol: 403_FORBIDDEN</span>
                </div>
            </main>
        </div>
    );
};

export default Restricted;