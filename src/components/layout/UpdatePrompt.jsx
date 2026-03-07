import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

const UpdatePrompt = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="right-6 bottom-6 z-[100] fixed max-w-[320px]">
      <div className="bg-[#18181b] shadow-2xl backdrop-blur-xl p-4 border border-white/10 rounded-2xl glass">
        <div className="flex items-start gap-4">
          <div className="bg-accent/10 p-2 rounded-xl text-accent">
            <RefreshCw size={20} className={needRefresh ? "animate-spin" : ""} />
          </div>
          <div className="flex-1">
            <h4 className="mb-1 font-bold text-white text-sm">
              {needRefresh ? "Update Available" : "System Ready"}
            </h4>
            <p className="text-[11px] text-white/50 italic uppercase leading-relaxed tracking-wider">
              {needRefresh ? "A new version of Ataraxia V2 is ready." : "App is ready to work offline."}
            </p>
            <div className="flex gap-3 mt-4">
              {needRefresh && (
                <button onClick={() => updateServiceWorker(true)} className="bg-accent shadow-glow px-4 py-2 rounded-lg font-black text-[10px] text-white uppercase tracking-widest hover:scale-105 transition-transform">
                  Update Now
                </button>
              )}
              <button onClick={close} className="bg-white/5 px-4 py-2 rounded-lg font-black text-[10px] text-white/40 uppercase tracking-widest">
                Dismiss
              </button>
            </div>
          </div>
          <button onClick={close} className="text-white/20 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;