import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Music } from 'lucide-react';

const MusicWidget = ({ isOpen, onClose }) => {
    const [hasBeenOpened, setHasBeenOpened] = useState(isOpen);
    const [isIframeLoading, setIsIframeLoading] = useState(true);
    const [iframeError, setIframeError] = useState(false);
    const [iframeKey, setIframeKey] = useState(0);

    if (isOpen && !hasBeenOpened) {
        setHasBeenOpened(true);
        setIsIframeLoading(true);
        setIframeError(false);
    }

    if (!hasBeenOpened) return null;

    const retryIframe = () => {
        setIframeError(false);
        setIsIframeLoading(true);
        setIframeKey((key) => key + 1);
    };

    return (
        <motion.div
            initial={false}
            animate={{
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.98,
                x: isOpen ? 0 : -40,
                pointerEvents: isOpen ? 'auto' : 'none',
                zIndex: isOpen ? 50 : -10
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="right-3 bottom-4 left-3 xs:right-4 xs:left-4 md:right-auto md:bottom-24 md:left-28 fixed"
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
                    {(isIframeLoading || iframeError) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-10">
                            {iframeError ? (
                                <>
                                    <Music size={32} className="text-white/20" />
                                    <p className="text-white/40 text-xs text-center px-4">
                                        Unable to load lofi.cafe.<br />
                                        Please check your connection and try again.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={retryIframe}
                                        className="px-4 py-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-white border border-white/10 rounded-xl transition-colors"
                                    >
                                        Retry
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Loader2 size={24} className="text-white/30 animate-spin" />
                                    <p className="text-white/30 text-[10px] uppercase tracking-widest">
                                        Loading music player...
                                    </p>
                                </>
                            )}
                        </div>
                    )}

                    <iframe
                        key={iframeKey}
                        src="https://www.lofi.cafe/"
                        loading="lazy"
                        className="border-none w-full h-full"
                        title="Lofi Cafe"
                        allow="autoplay; encrypted-media; fullscreen"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        onLoad={() => setIsIframeLoading(false)}
                        onError={() => {
                            setIsIframeLoading(false);
                            setIframeError(true);
                        }}
                    />

                    <div className="right-3 sm:right-4 bottom-3 sm:bottom-4 left-3 sm:left-4 absolute pointer-events-none">
                        <div className="bg-black/60 shadow-lg backdrop-blur-md p-2 border border-white/5 rounded-xl font-bold text-[7px] sm:text-[8px] text-white/40 text-center uppercase tracking-tighter">
                            Use ← → keys to change station | Space to Pause
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MusicWidget;