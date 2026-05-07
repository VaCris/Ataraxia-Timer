import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart, Coffee, Github, ExternalLink, Globe } from 'lucide-react';

const SupportModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="z-[110] fixed inset-0 flex justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                className="relative shadow-2xl p-10 border border-white/10 rounded-[3rem] w-full max-w-md text-center glass"
            >
                <button
                    onClick={onClose}
                    className="top-6 right-6 absolute p-2 text-white/20 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center mb-6">
                    <div className="flex justify-center items-center bg-accent/10 shadow-glow rounded-3xl w-20 h-20 text-accent">
                        <Heart size={40} fill="currentColor" />
                    </div>
                </div>

                <h2 className="mb-2 font-black text-2xl italic tracking-tighter">SUPPORT ATARAXIA</h2>
                <p className="mb-8 px-4 font-bold text-white/40 text-xs uppercase leading-relaxed tracking-widest">
                    Help us keep this space free of distractions and constantly evolving.
                </p>

                <div className="space-y-3">
                    <a
                        href="https://buymeacoffee.com/avid0"
                        target="_blank"
                        className="group flex justify-between items-center bg-white/5 hover:bg-white/10 p-5 border border-white/5 hover:border-accent/30 rounded-2xl transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <Coffee className="text-accent" size={20} />
                            <span className="font-bold text-sm tracking-tight">Buy me a Coffee</span>
                        </div>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <a
                        href="https://github.com/VaCris"
                        target="_blank"
                        className="group flex justify-between items-center bg-black/40 hover:bg-white/5 p-5 border border-white/5 rounded-2xl transition-all"
                    >
                        <div className="flex items-center gap-4 text-white/60">
                            <Github size={20} />
                            <span className="font-bold text-sm tracking-tight">Follow Development</span>
                        </div>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                </div>

                <div className="flex justify-center gap-6 mt-8 pt-8 border-white/5 border-t">
                    <Globe className="text-white/10 hover:text-accent transition-colors cursor-pointer" size={18} />
                    <span className="font-black text-[10px] text-white/10 uppercase tracking-[0.3em]">Studios TKOH</span>
                </div>
            </motion.div>
        </div>
    );
};

export default SupportModal;