import React from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { useMusic } from '@context/MusicContext';

const MusicWidget = () => {
    const { isModalOpen: isOpen, closeModal: onClose } = useMusic();

    return (
        <motion.div
            initial={false}
            animate={{
                opacity: isOpen ? 1 : 0,
                scale: isOpen ? 1 : 0.95,
                y: isOpen ? 0 : 40,
                pointerEvents: isOpen ? 'auto' : 'none',
                visibility: isOpen ? 'visible' : 'hidden'
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bottom-24 left-28 z-50 fixed"
        >
            <div className="flex flex-col bg-black/95 shadow-2xl backdrop-blur-3xl border border-white/10 rounded-[2.5rem] w-[550px] h-[600px] overflow-hidden glass">

                <div className="flex justify-between items-center p-6 border-white/5 border-b shrink-0">
                    <span className="font-black text-[9px] text-white/20 uppercase tracking-[0.3em]">Lofi.cafe Player</span>
                    <div className="flex items-center gap-4">
                         <a href="https://www.lofi.cafe/" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors" title="Abrir Lofi.cafe en nueva pestaña">
                            <Maximize2 size={16} />
                        </a>
                        <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="relative flex-1 bg-black">
                    <iframe
                        src="https://www.lofi.cafe/"
                        className="border-none w-full h-full"
                        title="Lofi Cafe"
                        allow="autoplay; encrypted-media"
                    />
                    <div className="right-4 bottom-4 left-4 absolute pointer-events-none">
                        <div className="bg-black/60 shadow-lg backdrop-blur-md p-2 border border-white/5 rounded-xl font-bold text-[8px] text-white/40 text-center uppercase tracking-tighter">
                            Use ← → keys to change station | Space to Pause
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MusicWidget;