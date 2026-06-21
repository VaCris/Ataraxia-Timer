import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UpdatePrompt = () => {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  const close = () => setNeedRefresh(false);

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="right-4 sm:right-6 bottom-20 sm:bottom-6 z-[100] fixed max-w-[calc(100vw-2rem)] sm:max-w-[340px]">
          <div className="relative bg-[#1a1a1b]/90 shadow-2xl backdrop-blur-2xl p-5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 bg-accent/20 p-2.5 rounded-xl text-accent"><RefreshCw size={20} className="animate-spin" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-white text-xs uppercase tracking-widest">Update Available</h4>
                  <Sparkles size={12} className="text-accent animate-pulse" />
                </div>
                <p className="mb-4 text-[10px] text-white/50 uppercase leading-relaxed tracking-widest">New version of Ataraxia V2 is ready.</p>
                <div className="flex gap-3">
                  <button onClick={() => updateServiceWorker(true)} className="flex-1 bg-accent px-4 py-2.5 rounded-xl font-black text-[10px] text-white uppercase tracking-widest">Update Now</button>
                  <button onClick={close} className="bg-white/5 px-4 py-2.5 rounded-xl font-black text-[10px] text-white/40 uppercase tracking-widest">Later</button>
                </div>
              </div>
              <button onClick={close} className="text-white/10 hover:text-white/40"><X size={14} /></button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdatePrompt;