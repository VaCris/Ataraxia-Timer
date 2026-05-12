import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  Sun,
  Monitor,
  Upload,
  Volume2,
  Clock,
  Trash2,
  Save,
  Bell,
  Keyboard,
  RotateCcw,
  Loader2,
} from 'lucide-react';

import { updateDurations, showToast } from '@/features/pomodoro/store/timerSlice';
import {
  updateUISettings,
  updateSettingsRequest,
} from '@/features/settings/store/settingsSlice';
import { setInitialTime } from '@/features/pomodoro/store/pomodoroSlice';
import {
  applyAccentColor,
  applyBgImage,
  applyBlur,
} from '@/shared/utils/theme';

const defaultShortcuts = {
  settings: 's',
  support: 'h',
  music: 'm',
  games: 'g',
  stats: 't',
  achievements: 'a',
};

const SettingsModal = ({ isOpen = true, onClose }) => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const uiSettings = settings.ui || {};
  const apiSettings = settings.api || {};
  const currentMode = useSelector((state) => state.timer.mode);

  const {
    focusDuration = 25,
    shortBreakDuration = 5,
    longBreakDuration = 15,
    autoStartBreaks = false,
    autoStartPomodoros = false,
    longBreakInterval = 4,
    is24Hour = true,
    theme = 'dark',
    soundEnabled = true,
    platform = 'web',
  } = apiSettings;

  const {
    accentColor = '#e11d48',
    bgImage = '',
    blurIntensity = 0,
    volume = 50,
    customShortcuts = defaultShortcuts,
  } = uiSettings;

  const [localTimers, setLocalTimers] = useState({
    FOCUS: focusDuration,
    SHORT_BREAK: shortBreakDuration,
    LONG_BREAK: longBreakDuration,
  });

  const [localInterval, setLocalInterval] = useState(longBreakInterval);
  const [localVolume, setLocalVolume] = useState(volume);
  const [activeShortcutKey, setActiveShortcutKey] = useState(null);

  const isSaving = settings.status === 'loading';

  const handleUISettingChange = (key, value) => {
    const nextUISettings = {
      ...uiSettings,
      [key]: value,
    };

    localStorage.setItem(
      `ataraxia_${key}`,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    );

    if (key === 'accentColor') applyAccentColor(value);
    if (key === 'bgImage') applyBgImage(value);
    if (key === 'blurIntensity') applyBlur(value);

    dispatch(updateUISettings(nextUISettings));
  };

  const handleSave = () => {
    const payload = {
      focusDuration: localTimers.FOCUS,
      shortBreakDuration: localTimers.SHORT_BREAK,
      longBreakDuration: localTimers.LONG_BREAK,
      autoStartBreaks,
      autoStartPomodoros,
      longBreakInterval: localInterval,
      is24Hour,
      theme,
      soundEnabled,
      platform,
    };

    dispatch(updateSettingsRequest(payload));

    if (currentMode === 'FOCUS') {
      dispatch(updateDurations({ mode: 'FOCUS', duration: localTimers.FOCUS }));
      dispatch(setInitialTime(localTimers.FOCUS * 60));
    }

    if (currentMode === 'SHORT_BREAK') {
      dispatch(updateDurations({ mode: 'SHORT_BREAK', duration: localTimers.SHORT_BREAK }));
      dispatch(setInitialTime(localTimers.SHORT_BREAK * 60));
    }

    if (currentMode === 'LONG_BREAK') {
      dispatch(updateDurations({ mode: 'LONG_BREAK', duration: localTimers.LONG_BREAK }));
      dispatch(setInitialTime(localTimers.LONG_BREAK * 60));
    }

    dispatch(
      updateUISettings({
        ...uiSettings,
        volume: localVolume,
      })
    );

    dispatch(showToast('Settings saved'));

    if (onClose) onClose();
  };

  const playTestAlarm = () => {
    const audio = new Audio('/sounds/alarm.mp3');
    audio.volume = Math.max(0, Math.min(1, Number(localVolume || 50) / 100));
    audio.play().catch(() => { });
  };

  const recordShortcut = (action) => {
    setActiveShortcutKey(action);

    const listener = (event) => {
      event.preventDefault();

      const key = event.key.toLowerCase();

      if (key !== 'escape' && key.length === 1) {
        handleUISettingChange('customShortcuts', {
          ...customShortcuts,
          [action]: key,
        });
      }

      setActiveShortcutKey(null);
      window.removeEventListener('keydown', listener);
    };

    window.addEventListener('keydown', listener);
  };

  if (!isOpen) return null;

  return (
    <div className="z-[100] fixed inset-0 flex justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative flex flex-col shadow-2xl p-6 md:p-8 border border-white/10 rounded-[3rem] w-full max-w-lg max-h-[90vh] overflow-hidden glass"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <span style={{ color: accentColor }}>/</span>
            CONFIGURATION
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="hover:bg-white/5 p-3 rounded-full text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-10 pr-2 pb-4 overflow-y-auto custom-scrollbar">
          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Clock size={14} />
              Timer Durations
            </div>

            <div className="gap-4 grid grid-cols-3 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
              <TimeInput
                label="Focus"
                value={localTimers.FOCUS}
                onChange={(value) =>
                  setLocalTimers({ ...localTimers, FOCUS: value })
                }
              />

              <TimeInput
                label="Short"
                value={localTimers.SHORT_BREAK}
                onChange={(value) =>
                  setLocalTimers({ ...localTimers, SHORT_BREAK: value })
                }
              />

              <TimeInput
                label="Long"
                value={localTimers.LONG_BREAK}
                onChange={(value) =>
                  setLocalTimers({ ...localTimers, LONG_BREAK: value })
                }
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                <Keyboard size={14} />
                Global Shortcuts
              </div>

              <button
                type="button"
                onClick={() =>
                  handleUISettingChange('customShortcuts', defaultShortcuts)
                }
                className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white uppercase tracking-widest"
              >
                <RotateCcw size={12} />
                reset
              </button>
            </div>

            <div className="gap-3 grid grid-cols-2 bg-white/5 p-6 rounded-[2rem]">
              {Object.entries(customShortcuts || defaultShortcuts).map(
                ([action, key]) => (
                  <div
                    key={action}
                    className="flex justify-between items-center bg-black/20 p-3 border border-white/5 rounded-xl"
                  >
                    <span className="font-bold text-[10px] text-white/40 uppercase tracking-tighter">
                      {action}
                    </span>

                    <button
                      type="button"
                      onClick={() => recordShortcut(action)}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors ${activeShortcutKey === action
                          ? 'bg-accent text-white'
                          : 'bg-white/10 text-white/80'
                        }`}
                      style={
                        activeShortcutKey === action
                          ? { backgroundColor: accentColor }
                          : {}
                      }
                    >
                      {activeShortcutKey === action ? '...' : key}
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Monitor size={14} />
              Workflow & Automation
            </div>

            <div className="space-y-4 bg-white/5 p-6 rounded-[2rem]">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">
                  Rounds before Long Break
                </span>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localInterval}
                  onChange={(event) =>
                    setLocalInterval(Number(event.target.value))
                  }
                  className="bg-black/40 px-3 py-1.5 border border-white/10 focus:border-white/30 rounded-lg outline-none w-16 text-white text-xs text-center"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">
                  Auto-start Breaks
                </span>

                <Switch
                  checked={autoStartBreaks}
                  onChange={() =>
                    dispatch(
                      updateSettingsRequest({
                        ...apiSettings,
                        autoStartBreaks: !autoStartBreaks,
                      })
                    )
                  }
                  accent={accentColor}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">
                  Auto-start Focus
                </span>

                <Switch
                  checked={autoStartPomodoros}
                  onChange={() =>
                    dispatch(
                      updateSettingsRequest({
                        ...apiSettings,
                        autoStartPomodoros: !autoStartPomodoros,
                      })
                    )
                  }
                  accent={accentColor}
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">
                  24-Hour Clock
                </span>

                <Switch
                  checked={is24Hour}
                  onChange={() =>
                    dispatch(
                      updateSettingsRequest({
                        ...apiSettings,
                        is24Hour: !is24Hour,
                      })
                    )
                  }
                  accent={accentColor}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Volume2 size={14} />
              Auditory Experience
            </div>

            <div className="space-y-6 bg-white/5 p-6 rounded-[2rem]">
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-[10px] text-white/30 uppercase">
                  <span>Master Volume</span>
                  <span>{Math.round(localVolume)}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={localVolume}
                  onChange={(event) =>
                    setLocalVolume(Number(event.target.value))
                  }
                  className="w-full accent-accent"
                  style={{ accentColor }}
                />
              </div>

              <button
                type="button"
                onClick={playTestAlarm}
                className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 py-4 rounded-xl w-full font-bold text-[10px] text-white/60 uppercase"
              >
                <Bell size={14} />
                Test Focus Alarm
              </button>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Sun size={14} />
              Visual Sanctuary
            </div>

            <div className="space-y-6 bg-white/5 p-6 rounded-[2rem]">
              <div className="flex justify-between items-center bg-black/20 p-4 border border-white/5 rounded-xl">
                <span className="text-white/60 text-xs">
                  Accent Theme
                </span>

                <div className="relative border-2 border-white/20 rounded-full w-8 h-8 overflow-hidden">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(event) =>
                      handleUISettingChange('accentColor', event.target.value)
                    }
                    className="absolute -inset-2 w-12 h-12 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-bold text-[10px] text-white/30 uppercase">
                  <span>Glass Blur Intensity</span>
                  <span>{blurIntensity}px</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={blurIntensity}
                  onChange={(event) =>
                    handleUISettingChange(
                      'blurIntensity',
                      Number(event.target.value)
                    )
                  }
                  className="w-full"
                  style={{ accentColor }}
                />
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={bgImage || ''}
                  onChange={(event) =>
                    handleUISettingChange('bgImage', event.target.value)
                  }
                  placeholder="Custom Image URL..."
                  className="bg-black/20 px-4 py-3 border border-white/10 focus:border-white/30 rounded-xl outline-none w-full text-white/80 text-xs"
                />

                <div className="flex gap-2">
                  <label className="flex flex-1 justify-center items-center gap-2 border border-white/10 hover:border-white/30 border-dashed rounded-xl h-12 text-white/40 text-xs transition-colors cursor-pointer">
                    <Upload size={14} />
                    Upload File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (!file) return;

                        const reader = new FileReader();

                        reader.onloadend = () => {
                          handleUISettingChange('bgImage', reader.result);
                        };

                        reader.readAsDataURL(file);
                      }}
                      hidden
                    />
                  </label>

                  {bgImage && (
                    <button
                      type="button"
                      onClick={() => handleUISettingChange('bgImage', '')}
                      className="flex justify-center items-center bg-red-500/10 hover:bg-red-500/20 rounded-xl w-12 h-12 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 pt-6 border-white/10 border-t">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{ backgroundColor: accentColor }}
            className="flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg py-5 rounded-3xl w-full font-black text-white text-xs uppercase tracking-[0.2em] transition-all"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Save size={18} />
                SAVE CONFIGURATION
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const TimeInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <input
      type="number"
      min="1"
      value={value || 0}
      onChange={(event) => onChange(Number(event.target.value))}
      className="bg-black/40 py-4 border border-white/5 rounded-2xl text-white text-lg text-center"
    />

    <label className="font-bold text-[9px] text-white/20 text-center uppercase">
      {label}
    </label>
  </div>
);

const Switch = ({ checked, onChange, accent }) => (
  <button
    type="button"
    onClick={onChange}
    className="relative rounded-full w-11 h-6 transition-colors cursor-pointer"
    style={{
      backgroundColor: checked ? accent : 'rgba(255,255,255,0.05)',
    }}
  >
    <motion.div
      animate={{ x: checked ? 20 : 4 }}
      className="top-1 absolute bg-white shadow-sm rounded-full w-4 h-4"
    />
  </button>
);

export default SettingsModal;