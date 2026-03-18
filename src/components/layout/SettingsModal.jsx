import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  X, Sun, Monitor, Upload, Volume2, Clock,
  Trash2, Save, Bell, Keyboard, RotateCcw, Loader2, Hash
} from 'lucide-react'
import { useAudio } from '@context/AudioContext'
import { updateDurations, showToast } from '@store/slices/timerSlice'
import { fetchSettingsSuccess, updateSettingsRequest } from '@store/slices/settingsSlice'

const SettingsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const settings = useSelector(s => s.settings)

  const { masterVolume, setMasterVolume, alarmVolume } = useAudio()
  const { timerSettings = { FOCUS: 25, SHORT_BREAK: 5, LONG_BREAK: 15 } } = settings.item || {}
  const [localTimers, setLocalTimers] = useState(timerSettings);

  const isSaving = useSelector(s => s.settings.status === 'loading')

  const {
    autoStartBreak = false,
    autoStartFocus = false,
    longBreakInterval = 4,
    accentColor = '#e11d48',
    bgImage = '',
    is24Hour = true,
    blurIntensity = 0,
    customShortcuts = { settings: 's', support: 'h', music: 'm', games: 'g', stats: 't', achievements: 'a' }
  } = settings.item || {}

  const [activeShortcutKey, setActiveShortcutKey] = useState(null)

  if (!isOpen) return null

  const handleTimerChange = (v) => {
    dispatch(fetchSettingsSuccess({
      ...settings.item,
      timerSettings: v
    }))
  }

  const handleSettingChange = (key, value) => {
    dispatch(fetchSettingsSuccess({
      ...settings.item,
      [key]: value
    }))
  }

  const handleSave = () => {
    const payload = {
      focusDuration: localTimers.FOCUS,
      shortBreakDuration: localTimers.SHORT_BREAK,
      longBreakDuration: localTimers.LONG_BREAK,
      autoStartBreaks: autoStartBreak,
      autoStartPomodoros: autoStartFocus,
      longBreakInterval,
      theme: "dark",
      soundEnabled: true,
      platform: "web"
    }

    dispatch(updateSettingsRequest(payload))

    dispatch(fetchSettingsSuccess({
      ...settings.item,
      timerSettings: localTimers
    }))

    dispatch(updateDurations({ mode: 'FOCUS', duration: localTimers.FOCUS }))
    dispatch(showToast('Settings saved'))
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => handleSettingChange('bgImage', reader.result)
    reader.readAsDataURL(file)
  }

  const playTestAlarm = () => {
    const audio = new Audio('/sounds/alarm.mp3')
    audio.volume = Number(masterVolume || 0.5) * Number(alarmVolume || 0.8)
    audio.play().catch(() => { })
  }

  const recordShortcut = (action) => {
    setActiveShortcutKey(action)
    const listener = (e) => {
      e.preventDefault()
      const key = e.key.toLowerCase()
      if (key !== 'escape' && key.length === 1) {
        handleSettingChange('customShortcuts', { ...customShortcuts, [action]: key })
      }
      setActiveShortcutKey(null)
      window.removeEventListener('keydown', listener)
    }
    window.addEventListener('keydown', listener)
  }

  const resetShortcuts = () => {
    handleSettingChange('customShortcuts', { settings: 's', support: 'h', music: 'm', games: 'g', stats: 't', achievements: 'a' })
  }

  return (
    <div className="z-[100] fixed inset-0 flex justify-center items-center p-4">
      {/* Overlay con Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: .9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: .9, opacity: 0, y: 20 }}
        className="relative flex flex-col shadow-2xl p-6 md:p-8 border border-white/10 rounded-[3rem] w-full max-w-lg max-h-[90vh] overflow-hidden glass"
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <span className="text-accent" style={{ color: accentColor }}>/</span> CONFIGURATION
          </h2>
          <button onClick={onClose} className="hover:bg-white/5 p-3 rounded-full text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-10 pr-2 pb-4 overflow-y-auto custom-scrollbar">

          {/* Timer Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Clock size={14} /> Timer Durations
            </div>
            <div className="gap-4 grid grid-cols-3 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
              <TimeInput label="Focus" value={localTimers.FOCUS} onChange={(v) => setLocalTimers({ ...localTimers, FOCUS: v })} />
              <TimeInput label="Short" value={localTimers.SHORT_BREAK} onChange={(v) => setLocalTimers({ ...localTimers, SHORT_BREAK: v })} />
              <TimeInput label="Long" value={localTimers.LONG_BREAK} onChange={(v) => setLocalTimers({ ...localTimers, LONG_BREAK: v })} />
            </div>
          </section>

          {/* Shortcuts Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                <Keyboard size={14} /> Global Shortcuts
              </div>
              <button onClick={resetShortcuts} className="flex items-center gap-1 font-bold text-[10px] text-white/30 hover:text-white uppercase tracking-widest">
                <RotateCcw size={12} /> reset
              </button>
            </div>
            <div className="gap-3 grid grid-cols-2 bg-white/5 p-6 rounded-[2rem]">
              {Object.entries(customShortcuts).map(([action, key]) => (
                <div key={action} className="flex justify-between items-center bg-black/20 p-3 border border-white/5 rounded-xl">
                  <span className="font-bold text-[10px] text-white/40 uppercase tracking-tighter">{action}</span>
                  <button
                    onClick={() => recordShortcut(action)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${activeShortcutKey === action ? 'bg-accent text-white' : 'bg-white/10 text-white/80'}`}
                  >
                    {activeShortcutKey === action ? '...' : key}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Monitor size={14} /> Workflow & Automation
            </div>
            <div className="space-y-4 bg-white/5 p-6 rounded-[2rem]">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Auto-start Breaks</span>
                <Switch checked={autoStartBreak} onChange={() => handleSettingChange('autoStartBreak', !autoStartBreak)} accent={accentColor} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">Auto-start Focus</span>
                <Switch checked={autoStartFocus} onChange={() => handleSettingChange('autoStartFocus', !autoStartFocus)} accent={accentColor} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-xs">24-Hour Clock</span>
                <Switch checked={is24Hour} onChange={() => handleSettingChange('is24Hour', !is24Hour)} accent={accentColor} />
              </div>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Sun size={14} /> Visual Sanctuary
            </div>
            <div className="space-y-6 bg-white/5 p-6 rounded-[2rem]">
              {/* Color Picker Custom */}
              <div className="flex justify-between items-center bg-black/20 p-4 border border-white/5 rounded-xl">
                <span className="text-white/60 text-xs">Accent Theme</span>
                <div className="relative border-2 border-white/20 rounded-full w-8 h-8 overflow-hidden">
                  <input type="color" value={accentColor} onChange={(e) => handleSettingChange('accentColor', e.target.value)} className="absolute -inset-2 w-12 h-12 cursor-pointer" />
                </div>
              </div>

              {/* Blur Intensity */}
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-[10px] text-white/30 uppercase">
                  <span>Glass Blur Intensity</span>
                  <span>{blurIntensity}px</span>
                </div>
                <input type="range" min="0" max="40" value={blurIntensity} onChange={(e) => handleSettingChange('blurIntensity', parseInt(e.target.value))} className="w-full accent-accent" style={{ accentColor }} />
              </div>

              {/* Background Management */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={bgImage}
                  onChange={(e) => handleSettingChange('bgImage', e.target.value)}
                  placeholder="Custom Image URL..."
                  className="bg-black/20 px-4 py-3 border border-white/10 focus:border-white/30 rounded-xl outline-none w-full text-white/80 placeholder:text-white/10 text-xs"
                />

                <div className="flex gap-2">
                  <label className="flex flex-1 justify-center items-center gap-2 border border-white/10 hover:border-white/30 border-dashed rounded-xl h-12 text-white/40 text-xs transition-colors cursor-pointer">
                    <Upload size={14} /> Upload Local File
                    <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                  </label>
                  {bgImage && (
                    <button onClick={() => handleSettingChange('bgImage', '')} className="flex justify-center items-center bg-red-500/10 hover:bg-red-500/20 rounded-xl w-12 h-12 text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Sound Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Volume2 size={14} /> Auditory Experience
            </div>
            <div className="space-y-6 bg-white/5 p-6 rounded-[2rem]">
              <div className="space-y-3">
                <div className="flex justify-between font-bold text-[10px] text-white/30 uppercase">
                  <span>Master Volume</span>
                  <span>{Math.round(masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  className="w-full accent-accent"
                  style={{ accentColor }}
                />
              </div>
              <button onClick={playTestAlarm} className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 py-4 rounded-xl w-full font-bold text-[10px] text-white/60 uppercase tracking-[0.2em] transition-colors">
                <Bell size={14} /> Test Focus Alarm
              </button>
            </div>
          </section>

        </div>

        {/* Action Footer */}
        <div className="mt-4 pt-6 border-white/10 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ backgroundColor: accentColor }}
            className="flex justify-center items-center gap-2 disabled:opacity-50 shadow-lg py-5 rounded-3xl w-full font-black text-white text-xs uppercase tracking-[0.2em] active:scale-95 transition-all"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> SAVE CONFIGURATION</>}
          </button>
        </div>

      </motion.div>
    </div>
  )
}

const TimeInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <input
      type="number" min="1" max="99"
      value={value || 0}
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-black/40 px-2 py-4 border border-white/5 focus:border-white/20 rounded-2xl focus:outline-none font-bold text-white text-lg text-center transition-colors"
    />
    <label className="font-bold text-[9px] text-white/20 text-center uppercase tracking-tighter">{label}</label>
  </div>
)

const Switch = ({ checked, onChange, accent }) => (
  <div
    onClick={onChange}
    className="relative rounded-full w-11 h-6 transition-colors cursor-pointer"
    style={{ backgroundColor: checked ? accent : 'rgba(255,255,255,0.05)' }}
  >
    <motion.div
      animate={{ x: checked ? 20 : 4 }}
      className="top-1 absolute bg-white shadow-sm rounded-full w-4 h-4"
    />
  </div>
)

export default SettingsModal;
