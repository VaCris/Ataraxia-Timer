import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Cog, Clock, ShieldAlert } from 'lucide-react';

const Maintenance = () => {
    return (
        <div className="relative flex flex-col justify-center items-center bg-[#050505] w-screen h-screen overflow-hidden text-cream">
            <div className="top-[-10%] left-[-10%] absolute bg-accent/10 blur-[120px] rounded-full w-[40%] h-[40%] pointer-events-none" />
            <div className="right-[-10%] bottom-[-10%] absolute bg-accent/5 blur-[120px] rounded-full w-[40%] h-[40%] pointer-events-none" />

            <main className="z-10 flex flex-col items-center px-6 max-w-2xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-8"
                >
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                    <div className="relative bg-white/5 shadow-2xl p-6 border border-white/10 rounded-[2.5rem] glass">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="-top-2 -right-2 absolute text-accent/40"
                        >
                            <Cog size={32} />
                        </motion.div>
                        <Hammer size={64} className="text-accent" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="mb-4 font-black text-4xl md:text-6xl italic uppercase tracking-tighter">
                        System Under <span className="text-accent">Maintenance</span>
                    </h1>

                    <p className="mb-8 font-medium text-white/50 text-sm md:text-base italic uppercase leading-relaxed tracking-wide">
                        We are currently upgrading Ataraxia to provide a better experience.
                        Our team is working hard to bring the system back online.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex md:flex-row flex-col gap-4 bg-black/40 p-1 border border-white/5 rounded-2xl scale-90"
                >
                    <div className="flex items-center gap-3 bg-surface shadow-glow px-6 py-3 border border-white/10 rounded-xl">
                        <Clock size={16} className="text-accent" />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Estimated Downtime: 2h</span>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 text-white/40">
                        <ShieldAlert size={16} />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Status: Core Offline</span>
                    </div>
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 0.6 }}
                    className="bottom-12 absolute flex flex-col items-center"
                >
                    <div className="bg-white/20 mb-4 w-12 h-[1px]" />
                    <p className="font-black text-[9px] uppercase tracking-[0.4em]">Ataraxia V2 Security System</p>
                </motion.footer>
            </main>
        </div>
    );
};

export default Maintenance;