import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ShieldCheck } from 'lucide-react';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('ataraxia_cookies');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('ataraxia_cookies', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="bottom-6 left-6 z-[100] fixed w-[calc(100vw-3rem)] max-w-[350px]"
                >
                    <div className="relative bg-[#121214]/80 shadow-2xl backdrop-blur-2xl p-6 border border-white/10 rounded-[2rem] overflow-hidden glass">
                        <div className="-top-10 -right-10 absolute bg-accent/10 blur-[50px] rounded-full w-32 h-32 pointer-events-none" />

                        <div className="relative flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-accent/10 shadow-glow p-2.5 rounded-2xl text-accent">
                                    <Cookie size={24} />
                                </div>
                                <h3 className="font-black text-white text-sm italic uppercase tracking-widest">
                                    Cookie <span className="text-accent text-xs">Policy</span>
                                </h3>
                            </div>

                            <p className="font-medium text-[11px] text-white/50 italic uppercase leading-relaxed tracking-wider">
                                We use cookies to enhance your focus experience and sync your data across devices. By continuing, you agree to our terminal protocols.
                            </p>

                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-accent hover:bg-accent/80 shadow-glow py-3 rounded-xl font-black text-[10px] text-white uppercase tracking-[0.2em] active:scale-95 transition-all"
                                >
                                    Accept Protocols
                                </button>
                                <button
                                    onClick={() => setIsVisible(false)}
                                    className="bg-white/5 hover:bg-white/10 px-4 py-3 border border-white/5 rounded-xl text-white/40 hover:text-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 font-bold text-[9px] text-white/20 uppercase tracking-widest">
                                <ShieldCheck size={12} />
                                Secure Connection Active
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;