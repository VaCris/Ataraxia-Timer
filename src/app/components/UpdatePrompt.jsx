import React, { useEffect, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { startVersionGuard } from '@/shared/version/startVersionGuard';

const UpdatePrompt = () => {
  const versionGuardCleanupRef = useRef(null);
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      versionGuardCleanupRef.current?.();
      versionGuardCleanupRef.current = startVersionGuard(registration);
    },
    onRegisterError(error) {
      console.error(error);
    },
  });

  const [changelog, setChangelog] = useState([]);
  const [version, setVersion] = useState('');
  const close = () => setNeedRefresh(false);

  useEffect(() => () => {
    versionGuardCleanupRef.current?.();
    versionGuardCleanupRef.current = null;
  }, []);

  useEffect(() => {
    if (!needRefresh) return;

    fetch('/version.json?t=' + Date.now(), { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        setChangelog(data.changelog || []);
        setVersion(data.appVersion || data.version || '');
      })
      .catch(() => {});
  }, [needRefresh]);

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="right-4 sm:right-6 bottom-20 sm:bottom-6 z-[100] fixed max-w-[calc(100vw-2rem)] sm:max-w-[340px)]"
        >
          <div className="relative bg-[#1a1a1b]/90 shadow-2xl backdrop-blur-2xl p-5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 bg-accent/20 p-2.5 rounded-xl text-accent">
                <RefreshCw size={20} className="animate-spin" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-white text-xs uppercase tracking-widest">
                    Update Available
                  </h4>
                  <Sparkles size={12} className="text-accent animate-pulse" />
                </div>

                {version && (
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">
                    v{version}
                  </p>
                )}

                {changelog.length > 0 && (
                  <ul className="mb-4 space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {changelog.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-2 text-[10px] text-white/60 leading-snug"
                      >
                        <Check size={10} className="mt-0.5 flex-shrink-0 text-accent" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateServiceWorker(true)}
                    className="flex-1 bg-accent px-4 py-2.5 rounded-xl font-black text-[10px] text-white uppercase tracking-widest"
                  >
                    Update Now
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="bg-white/5 px-4 py-2.5 rounded-xl font-black text-[10px] text-white/40 uppercase tracking-widest"
                  >
                    Later
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                className="text-white/10 hover:text-white/40"
                aria-label="Dismiss update"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdatePrompt;
