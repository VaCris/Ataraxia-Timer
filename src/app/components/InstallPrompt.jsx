import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useInstallPrompt } from '@/shared/hooks/useInstallPrompt';
import LogoSVG from '@assets/pwa-192x192.svg';

const INSTALL_PROMPT_DISMISSED_KEY = 'ataraxia_install_prompt_dismissed';

const InstallPrompt = () => {
    const { isInstallable, handleInstallClick } = useInstallPrompt();
    const [isVisible, setIsVisible] = useState(false);
    const accentColor = useSelector((state) => state.settings.ui?.accentColor || '#e11d48');

    useEffect(() => {
        if (!isInstallable) {
            Promise.resolve().then(() => setIsVisible(false));
            return;
        }

        const dismissed = localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === 'true';

        if (dismissed) {
            Promise.resolve().then(() => setIsVisible(false));
            return;
        }

        const timer = setTimeout(() => setIsVisible(true), 2500);
        return () => clearTimeout(timer);
    }, [isInstallable]);

    const handleDismiss = () => {
        localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, 'true');
        setIsVisible(false);
    };

    const handleInstall = async () => {
        await handleInstallClick();
        localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, 'true');
        setIsVisible(false);
    };

    if (!isInstallable) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 18, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="right-4 bottom-4 left-4 xs:left-auto xs:right-5 xs:bottom-5 z-[100] fixed xs:w-[410px] max-w-[calc(100vw-2rem)]"
                >
                    <div className="relative flex flex-col xs:flex-row xs:items-center gap-4 bg-[#101012]/95 shadow-2xl backdrop-blur-2xl p-4 border border-white/10 rounded-3xl overflow-hidden">
                        <div
                            className="absolute inset-0 opacity-[0.08] pointer-events-none"
                            style={{ background: `radial-gradient(circle at top right, ${accentColor}, transparent 55%)` }}
                        />

                        <div className="relative flex justify-center items-center bg-white/5 p-2.5 border border-white/10 rounded-2xl w-14 h-14 shrink-0">
                            <img src={LogoSVG} alt="Ataraxia" className="w-full h-full object-contain" />
                        </div>

                        <div className="relative flex-1 min-w-0">
                            <h4 className="font-black text-white text-xs uppercase tracking-[0.18em]">
                                Install Ataraxia
                            </h4>

                            <p className="mt-1 text-[11px] text-white/45 leading-relaxed">
                                Add it to your device for quick access and a cleaner fullscreen focus mode.
                            </p>
                        </div>

                        <div className="relative flex items-center gap-2 xs:ml-1 shrink-0">
                            <button
                                type="button"
                                onClick={handleInstall}
                                style={{ backgroundColor: accentColor }}
                                className="flex flex-1 xs:flex-none justify-center items-center gap-2 shadow-glow hover:brightness-125 px-5 py-3 rounded-2xl font-black text-[10px] text-white uppercase tracking-[0.14em] transition-all active:scale-[0.98]"
                            >
                                <Download size={14} strokeWidth={3} />
                                Install
                            </button>

                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="flex justify-center items-center hover:bg-white/10 rounded-full w-9 h-9 text-white/30 hover:text-white transition-colors"
                                aria-label="Dismiss install prompt"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
