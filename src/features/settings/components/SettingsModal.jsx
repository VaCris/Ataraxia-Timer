import React, { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
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

const defaultShortcuts = {
  settings: 's',
  support: 'h',
  music: 'm',
  games: 'g',
  stats: 't',
  achievements: 'a',
};

const normalizeShortcuts = (shortcuts) => {
  if (!shortcuts || Object.keys(shortcuts).length === 0) {
    return defaultShortcuts;
  }

  return {
    ...defaultShortcuts,
    ...shortcuts,
  };
};

const persistUISetting = (key, value) => {
  localStorage.setItem(
    `ataraxia_${key}`,
    typeof value === 'object' ? JSON.stringify(value) : String(value)
  );
};

const readStoredValue = (key, fallback) => {
  const value = localStorage.getItem(`ataraxia_${key}`);

  if (value === null || value === undefined) {
    return fallback;
  }

  return value;
};

const readStoredBoolean = (key, fallback) => {
  const value = localStorage.getItem(`ataraxia_${key}`);

  if (value === null || value === undefined) {
    return fallback;
  }

  return value === 'true';
};

const readStoredNumber = (key, fallback) => {
  const value = localStorage.getItem(`ataraxia_${key}`);

  if (value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readStoredShortcuts = (fallback) => {
  try {
    const value = localStorage.getItem('ataraxia_customShortcuts');

    if (!value) {
      return normalizeShortcuts(fallback);
    }

    return normalizeShortcuts(JSON.parse(value));
  } catch {
    return normalizeShortcuts(fallback);
  }
};

const clampNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const SettingsModal = ({ isOpen = true, onClose }) => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const currentMode = useSelector((state) => state.timer.mode);

  const uiSettings = settings.ui || {};
  const apiSettings = settings.api || {};

  const {
    focusDuration = 25,
    shortBreakDuration = 5,
    longBreakDuration = 15,
    autoStartBreaks = false,
    autoStartPomodoros = false,
    longBreakInterval = 4,
    theme = 'dark',
    soundEnabled = true,
    platform = 'web',
  } = apiSettings;

  const {
    accentColor = '#e11d48',
    bgImage = '',
    blurIntensity = 0,
    volume = 50,
    is24Hour = false,
    customShortcuts = defaultShortcuts,
  } = uiSettings;

  const [localTimers, setLocalTimers] = useState(() => ({
    FOCUS: readStoredNumber('focusDuration', focusDuration),
    SHORT_BREAK: readStoredNumber('shortBreakDuration', shortBreakDuration),
    LONG_BREAK: readStoredNumber('longBreakDuration', longBreakDuration),
  }));

  const [localApiSettings, setLocalApiSettings] = useState(() => ({
    autoStartBreaks: readStoredBoolean('autoStartBreaks', autoStartBreaks),
    autoStartPomodoros: readStoredBoolean('autoStartPomodoros', autoStartPomodoros),
    longBreakInterval: readStoredNumber('longBreakInterval', longBreakInterval),
    theme: readStoredValue('theme', theme),
    soundEnabled: readStoredBoolean('soundEnabled', soundEnabled),
    platform: readStoredValue('platform', platform),
  }));

  const [localUISettings, setLocalUISettings] = useState(() => ({
    accentColor: readStoredValue('accentColor', accentColor),
    bgImage: readStoredValue('bgImage', bgImage || ''),
    blurIntensity: readStoredNumber('blurIntensity', blurIntensity),
    volume: readStoredNumber('volume', volume),
    is24Hour: readStoredBoolean('is24Hour', is24Hour),
    customShortcuts: readStoredShortcuts(customShortcuts),
  }));

  const [activeShortcutKey, setActiveShortcutKey] = useState(null);

  const isSaving = settings.status === 'loading';
  const localAccentColor = localUISettings.accentColor;
  const visibleShortcuts = normalizeShortcuts(localUISettings.customShortcuts);

  const handleUISettingChange = useCallback((key, value) => {
    setLocalUISettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleTimerChange = useCallback((mode, value) => {
    setLocalTimers((prev) => ({
      ...prev,
      [mode]: clampNumber(value, prev[mode]),
    }));
  }, []);

  const handleApiSettingChange = useCallback((key, value) => {
    setLocalApiSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleResetShortcuts = useCallback(() => {
    handleUISettingChange('customShortcuts', defaultShortcuts);
  }, [handleUISettingChange]);

  const handleSave = useCallback(() => {
    const payload = {
      focusDuration: localTimers.FOCUS,
      shortBreakDuration: localTimers.SHORT_BREAK,
      longBreakDuration: localTimers.LONG_BREAK,
      autoStartBreaks: localApiSettings.autoStartBreaks,
      autoStartPomodoros: localApiSettings.autoStartPomodoros,
      longBreakInterval: localApiSettings.longBreakInterval,
      theme: localApiSettings.theme,
      soundEnabled: localApiSettings.soundEnabled,
      platform: localApiSettings.platform,
    };

    const durationByMode = {
      FOCUS: localTimers.FOCUS,
      SHORT_BREAK: localTimers.SHORT_BREAK,
      LONG_BREAK: localTimers.LONG_BREAK,
    };

    const uiPayload = {
      ...localUISettings,
      customShortcuts: normalizeShortcuts(localUISettings.customShortcuts),
    };

    Object.entries(payload).forEach(([key, value]) => {
      persistUISetting(key, value);
    });

    Object.entries(uiPayload).forEach(([key, value]) => {
      persistUISetting(key, value);
    });

    dispatch(updateSettingsRequest(payload));

    dispatch(
      updateDurations({
        mode: currentMode,
        duration: durationByMode[currentMode],
      })
    );

    dispatch(updateUISettings(uiPayload));
    dispatch(showToast('Settings saved'));

    toast.success('Properly saved configuration', {
      id: 'settings-saved',
    });

    if (onClose) onClose();
  }, [
    currentMode,
    dispatch,
    localApiSettings,
    localTimers,
    localUISettings,
    onClose,
  ]);

  const playTestAlarm = useCallback(() => {
    const audio = new Audio('/sounds/alarm.mp3');
    audio.volume = Math.max(0, Math.min(1, Number(localUISettings.volume || 50) / 100));
    audio.play().catch(() => { });
  }, [localUISettings.volume]);

  const recordShortcut = useCallback((action) => {
    setActiveShortcutKey(action);

    const listener = (event) => {
      event.preventDefault();

      const key = event.key.toLowerCase();

      if (key !== 'escape' && key.length === 1) {
        handleUISettingChange('customShortcuts', {
          ...normalizeShortcuts(localUISettings.customShortcuts),
          [action]: key,
        });
      }

      setActiveShortcutKey(null);
      window.removeEventListener('keydown', listener);
    };

    window.addEventListener('keydown', listener);
  }, [handleUISettingChange, localUISettings.customShortcuts]);

  if (!isOpen) return null;

  return (
    <div className="z-[100] fixed inset-0 flex justify-center items-end sm:items-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 24 }}
        transition={{ duration: 0.18 }}
        className="relative flex flex-col shadow-2xl p-4 xs:p-5 sm:p-6 md:p-8 border border-white/10 rounded-t-[2rem] sm:rounded-[3rem] w-full sm:max-w-lg h-[92dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden glass"
      >
        <div className="flex justify-between items-center mb-5 sm:mb-6 shrink-0">
          <h2 className="flex items-center gap-3 font-black text-xl xs:text-2xl tracking-tighter min-w-0">
            <span style={{ color: localAccentColor }}>/</span>
            <span className="truncate">CONFIGURATION</span>
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="hover:bg-white/5 p-3 rounded-full text-white/40 hover:text-white transition-colors shrink-0"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 space-y-8 sm:space-y-10 pr-1 sm:pr-2 pb-4 overflow-y-auto custom-scrollbar min-h-0">
          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.24em] sm:tracking-[0.3em]">
              <Clock size={14} />
              Timer Durations
            </div>

            <div className="gap-3 sm:gap-4 grid grid-cols-1 xs:grid-cols-3 bg-white/5 p-4 sm:p-6 border border-white/5 rounded-[1.5rem] sm:rounded-[2rem]">
              <TimeInput
                label="Focus"
                value={localTimers.FOCUS}
                onChange={(value) => handleTimerChange('FOCUS', value)}
              />

              <TimeInput
                label="Short"
                value={localTimers.SHORT_BREAK}
                onChange={(value) => handleTimerChange('SHORT_BREAK', value)}
              />

              <TimeInput
                label="Long"
                value={localTimers.LONG_BREAK}
                onChange={(value) => handleTimerChange('LONG_BREAK', value)}
              />
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center gap-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-[10px] text-white/30 uppercase tracking-[0.24em] sm:tracking-[0.3em] min-w-0">
                <Keyboard size={14} className="shrink-0" />
                <span className="truncate">Global Shortcuts</span>
              </div>

              <button
                type="button"
                onClick={handleResetShortcuts}
                className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white uppercase tracking-widest shrink-0"
              >
                <RotateCcw size={12} />
                reset
              </button>
            </div>

            <div className="gap-3 grid grid-cols-1 xs:grid-cols-2 bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem]">
              {Object.entries(visibleShortcuts).map(([action, key]) => (
                <div
                  key={action}
                  className="flex justify-between items-center gap-3 bg-black/20 p-3 border border-white/5 rounded-xl min-w-0"
                >
                  <span className="font-bold text-[10px] text-white/40 uppercase tracking-tighter truncate">
                    {action}
                  </span>

                  <button
                    type="button"
                    onClick={() => recordShortcut(action)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors shrink-0 ${activeShortcutKey === action
                      ? 'bg-accent text-white'
                      : 'bg-white/10 text-white/80'
                      }`}
                    style={activeShortcutKey === action ? { backgroundColor: localAccentColor } : {}}
                  >
                    {activeShortcutKey === action ? '...' : key}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.24em] sm:tracking-[0.3em]">
              <Monitor size={14} />
              Workflow & Automation
            </div>

            <div className="space-y-4 bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem]">
              <div className="flex justify-between items-center gap-4">
                <span className="text-white/60 text-xs">
                  Rounds before Long Break
                </span>

                <input
                  type="number"
                  min="1"
                  max="10"
                  value={localApiSettings.longBreakInterval}
                  onChange={(event) =>
                    handleApiSettingChange('longBreakInterval', clampNumber(event.target.value, 4))
                  }
                  className="bg-black/40 px-3 py-1.5 border border-white/10 focus:border-white/30 rounded-lg outline-none w-16 text-white text-xs text-center shrink-0"
                />
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-white/60 text-xs">
                  Auto-start Breaks
                </span>

                <Switch
                  checked={localApiSettings.autoStartBreaks}
                  onChange={() =>
                    handleApiSettingChange('autoStartBreaks', !localApiSettings.autoStartBreaks)
                  }
                  accent={localAccentColor}
                />
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-white/60 text-xs">
                  Auto-start Focus
                </span>

                <Switch
                  checked={localApiSettings.autoStartPomodoros}
                  onChange={() =>
                    handleApiSettingChange('autoStartPomodoros', !localApiSettings.autoStartPomodoros)
                  }
                  accent={localAccentColor}
                />
              </div>

              <div className="flex justify-between items-center gap-4">
                <span className="text-white/60 text-xs">
                  24-Hour Clock
                </span>

                <Switch
                  checked={localUISettings.is24Hour}
                  onChange={() =>
                    handleUISettingChange('is24Hour', !localUISettings.is24Hour)
                  }
                  accent={localAccentColor}
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.24em] sm:tracking-[0.3em]">
              <Volume2 size={14} />
              Auditory Experience
            </div>

            <div className="space-y-6 bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem]">
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-[10px] text-white/30 uppercase">
                  <span>Master Volume</span>
                  <span>{Math.round(localUISettings.volume)}%</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={localUISettings.volume}
                  onChange={(event) =>
                    handleUISettingChange('volume', clampNumber(event.target.value, 50))
                  }
                  className="w-full accent-accent"
                  style={{ accentColor: localAccentColor }}
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
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.24em] sm:tracking-[0.3em]">
              <Sun size={14} />
              Visual Sanctuary
            </div>

            <div className="space-y-6 bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem]">
              <div className="flex justify-between items-center gap-4 bg-black/20 p-4 border border-white/5 rounded-xl">
                <span className="text-white/60 text-xs">
                  Accent Theme
                </span>

                <div className="relative border-2 border-white/20 rounded-full w-8 h-8 overflow-hidden shrink-0">
                  <input
                    type="color"
                    value={localAccentColor}
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
                  <span>{localUISettings.blurIntensity}px</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={localUISettings.blurIntensity}
                  onChange={(event) =>
                    handleUISettingChange('blurIntensity', clampNumber(event.target.value, 0))
                  }
                  className="w-full"
                  style={{ accentColor: localAccentColor }}
                />
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={localUISettings.bgImage || ''}
                  onChange={(event) =>
                    handleUISettingChange('bgImage', event.target.value)
                  }
                  placeholder="Custom Image URL..."
                  className="bg-black/20 px-4 py-3 border border-white/10 focus:border-white/30 rounded-xl outline-none w-full text-white/80 text-xs"
                />

                <div className="flex gap-2">
                  <label className="flex flex-1 justify-center items-center gap-2 border border-white/10 hover:border-white/30 border-dashed rounded-xl h-12 text-white/40 text-xs transition-colors cursor-pointer min-w-0">
                    <Upload size={14} className="shrink-0" />
                    <span className="truncate">Upload File</span>
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

                  {localUISettings.bgImage && (
                    <button
                      type="button"
                      onClick={() => handleUISettingChange('bgImage', '')}
                      className="flex justify-center items-center bg-red-500/10 hover:bg-red-500/20 rounded-xl w-12 h-12 text-red-500 shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 pt-4 sm:pt-6 border-white/10 border-t shrink-0">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{ backgroundColor: localAccentColor }}
            className="flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg py-4 sm:py-5 rounded-2xl sm:rounded-3xl w-full font-black text-white text-[11px] xs:text-xs uppercase tracking-[0.16em] xs:tracking-[0.2em] transition-all"
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

const TimeInput = memo(({ label, value, onChange }) => (
  <div className="flex xs:flex-col justify-between xs:justify-start items-center xs:items-stretch gap-2 bg-black/20 xs:bg-transparent p-3 xs:p-0 rounded-2xl">
    <input
      type="number"
      min="1"
      value={value || 0}
      onChange={(event) => onChange(Number(event.target.value))}
      className="bg-black/40 py-3 xs:py-4 border border-white/5 rounded-2xl w-24 xs:w-full text-white text-base xs:text-lg text-center"
    />

    <label className="font-bold text-[9px] text-white/20 text-center uppercase">
      {label}
    </label>
  </div>
));

TimeInput.displayName = 'TimeInput';

const Switch = memo(({ checked, onChange, accent }) => (
  <button
    type="button"
    onClick={onChange}
    className="relative rounded-full w-11 h-6 transition-colors cursor-pointer shrink-0"
    style={{
      backgroundColor: checked ? accent : 'rgba(255,255,255,0.05)',
    }}
  >
    <motion.div
      animate={{ x: checked ? 20 : 4 }}
      transition={{ duration: 0.15 }}
      className="top-1 absolute bg-white shadow-sm rounded-full w-4 h-4"
    />
  </button>
));

Switch.displayName = 'Switch';

export default SettingsModal;
