import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const ThemeChangeIndicator = ({ theme, visible, accentColor = '#14b8a6' }) => {
  const reduceMotion = useReducedMotion();
  const isLight = theme === 'light';
  const label = isLight ? 'LIGHT MODE' : 'DARK MODE';
  const Icon = isLight ? Sun : Moon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`${theme}-theme-indicator`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.08 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 left-4 lg:left-[6.75rem] z-[80] pointer-events-none"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div
            className="flex items-center gap-2.5 rounded-full border px-3.5 py-2 shadow-2xl backdrop-blur-xl"
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              backgroundColor: 'rgba(8, 8, 10, 0.78)',
              boxShadow: `0 8px 30px -14px ${accentColor}99`,
            }}
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}1f` }}
              aria-hidden="true"
            >
              <Icon size={13} strokeWidth={2.4} />
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/85">
              {label}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeChangeIndicator;
