import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MusicWidget = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, x: -40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98, x: -40 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="right-3 bottom-4 left-3 xs:right-4 xs:left-4 md:right-auto md:bottom-24 md:left-28 z-50 fixed"
                >
                    <div className="flex flex-col bg-black/95 shadow-2xl backdrop-blur-3xl border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] w-full md:w-[550px] h-[70dvh] max-h-[600px] min-h-[420px] overflow-hidden glass">
                        <div className="flex justify-between items-center p-4 sm:p-6 border-white/5 border-b shrink-0">
                            <span className="font-black text-[8px] sm:text-[9px] text-white/20 uppercase tracking-[0.24em] sm:tracking-[0.3em] truncate">
                                Lofi.cafe Player
                            </span>

                            <div className="flex items-center gap-4 shrink-0">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-white/30 hover:text-white transition-colors"
                                    aria-label="Close music player"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="relative flex-1 bg-black min-h-0">
                            <iframe
                                src="https://www.lofi.cafe/"
                                className="border-none w-full h-full"
                                title="Lofi Cafe"
                                allow="autoplay; encrypted-media"
                                loading="lazy"
                            />

                            <div className="right-3 sm:right-4 bottom-3 sm:bottom-4 left-3 sm:left-4 absolute pointer-events-none">
                                <div className="bg-black/60 shadow-lg backdrop-blur-md p-2 border border-white/5 rounded-xl font-bold text-[7px] sm:text-[8px] text-white/40 text-center uppercase tracking-tighter">
                                    Use ← → keys to change station | Space to Pause
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MusicWidget;
