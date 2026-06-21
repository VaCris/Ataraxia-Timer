import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const CONSENT_KEY = 'ataraxia_cookie_consent';
const LEGACY_CONSENT_KEY = 'ataraxia_cookies';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);
        const legacyConsent = localStorage.getItem(LEGACY_CONSENT_KEY);

        if (!consent && !legacyConsent) {
            const timer = setTimeout(() => setIsVisible(true), 1200);
            return () => clearTimeout(timer);
        }
    }, []);

    const saveConsent = (value) => {
        localStorage.setItem(CONSENT_KEY, value);
        localStorage.removeItem(LEGACY_CONSENT_KEY);
        setIsVisible(false);
    };

    const handleAccept = () => {
        saveConsent('accepted');
    };

    const handleDismiss = () => {
        saveConsent('dismissed');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="right-4 bottom-4 left-4 xs:left-auto xs:right-5 xs:bottom-5 z-[100] fixed xs:w-[390px] max-w-[calc(100vw-2rem)]"
                >
                    <div className="relative bg-[#101012]/95 shadow-2xl backdrop-blur-2xl p-4 xs:p-5 border border-white/10 rounded-3xl overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="relative flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex justify-center items-center bg-white/7 border border-white/10 rounded-2xl w-11 h-11 text-white/70 shrink-0">
                                        <Cookie size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="font-black text-white text-sm uppercase tracking-[0.16em]">
                                            Privacy notice
                                        </h3>

                                        <p className="mt-1 text-[11px] text-white/35 leading-none">
                                            Preferences saved on this device
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDismiss}
                                    className="flex justify-center items-center hover:bg-white/10 rounded-full w-8 h-8 text-white/35 hover:text-white transition-colors shrink-0"
                                    aria-label="Dismiss privacy notice"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <p className="text-[12px] text-white/55 leading-relaxed">
                                Ataraxia stores small preferences like your timer settings, theme, install choice and this notice. No ad tracking, no selling data, no unnecessary cookies.
                            </p>

                            <div className="flex flex-col xs:flex-row gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={handleAccept}
                                    className="flex-1 bg-white hover:bg-white/90 px-4 py-3 rounded-2xl font-black text-[10px] text-black uppercase tracking-[0.18em] active:scale-[0.98] transition-all"
                                >
                                    Got it
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDismiss}
                                    className="flex-1 xs:flex-none bg-white/5 hover:bg-white/10 px-4 py-3 border border-white/10 rounded-2xl font-black text-[10px] text-white/55 hover:text-white uppercase tracking-[0.18em] active:scale-[0.98] transition-all"
                                >
                                    Not now
                                </button>
                            </div>

                            <div className="flex items-center gap-2 pt-1 text-[10px] text-white/30 leading-relaxed">
                                <ShieldCheck size={13} className="shrink-0" />
                                <span>Your focus data stays in your browser unless you choose to sync.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
