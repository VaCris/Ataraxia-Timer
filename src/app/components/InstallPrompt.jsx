import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useInstallPrompt } from '@/shared/hooks/useInstallPrompt';
import LogoSVG from '@assets/pwa-192x192.svg';

const InstallPrompt = () => {
    const { isInstallable, handleInstallClick } = useInstallPrompt();
    const [isVisible, setIsVisible] = useState(false);
    const accentColor = useSelector(state => state.settings.accentColor);

    useEffect(() => {
        if (isInstallable) {
            const timer = setTimeout(() => setIsVisible(true), 3000);
            return () => clearTimeout(timer);
        }
    }, [isInstallable]);

    if (!isInstallable) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.9 }}
                    className="right-8 bottom-8 z-[100] fixed flex items-center gap-4 bg-[#0a0a0a]/90 shadow-2xl backdrop-blur-2xl p-4 pr-6 border border-white/10 rounded-[2rem] overflow-hidden"
                >
                    <div 
                        className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ background: `radial-gradient(circle at center, ${accentColor}, transparent)` }} 
                    />

                    <div className="relative flex justify-center items-center bg-white/5 p-2.5 border border-white/5 rounded-2xl w-14 h-14">
                        <img src={LogoSVG} alt="Ataraxia" className="w-full h-full object-contain" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <h4 className="font-black text-white text-xs italic uppercase tracking-widest">Ataraxia V2</h4>
                        <p className="max-w-[140px] text-[10px] text-white/40 leading-tight">Install as a desktop or mobile application.</p>
                    </div>

                    <div className="flex items-center gap-2 ml-2">
                        <button
                            onClick={handleInstallClick}
                            style={{ backgroundColor: accentColor }}
                            className="flex items-center gap-2 shadow-glow hover:brightness-125 px-5 py-2.5 rounded-xl font-black text-[10px] text-white uppercase tracking-tighter transition-all"
                        >
                            <Download size={14} strokeWidth={3} />
                            Install
                        </button>
                        
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-2 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;