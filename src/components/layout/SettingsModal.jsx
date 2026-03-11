import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { X, Sun, Monitor, Upload, Volume2, Clock, Trash2, Save, Bell, Keyboard, RotateCcw, Loader2 } from 'lucide-react'
import { useAudio } from '@context/AudioContext'
import { updateTimerRequest } from '@store/slices/timerSlice'
import { fetchSettingsRequest, updateSettingsRequest } from '@store/slices/settingsSlice'

const SettingsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { masterVolume, setMasterVolume, alarmVolume } = useAudio()

  const settings = useSelector(s => s.settings)
  const timers = useSelector(s => s.timer)
  const isSaving = useSelector(s => s.settings.status === 'loading')

  const {
    autoStartBreak,
    autoStartFocus,
    longBreakInterval,
    accentColor,
    bgImage,
    is24Hour,
    blurIntensity = 0,
    customShortcuts = { settings: 's', support: 'h', music: 'm', games: 'g', stats: 't', achievements: 'a' }
  } = settings

  const { timerSettings = { FOCUS: 25, SHORT_BREAK: 5, LONG_BREAK: 15 } } = timers

  const [activeShortcutKey, setActiveShortcutKey] = useState(null)

  if (!isOpen) return null

  const handleTimerChange = (v) => dispatch(updateTimerRequest(v))
  const handleSettingChange = (k, v) => dispatch(updateSettings({ [k]: v }))
  const handleSave = () => {
    dispatch(updateSettingsRequest(settings))
    onClose()
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
      <motion.div initial={{ scale: .9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: .9, opacity: 0, y: 20 }} className="relative flex flex-col shadow-2xl p-6 md:p-8 border border-white/10 rounded-[3rem] w-full max-w-lg max-h-[90vh] overflow-hidden glass">

        <div className="flex justify-between items-center mb-6">
          <h2 className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <span className="text-accent" style={{ color: accentColor }}>/</span> CONFIGURATION
          </h2>
          <button onClick={onClose} className="hover:bg-white/5 p-3 rounded-full text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 space-y-10 pr-2 pb-4 overflow-y-auto">

          <section>
            <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
              <Clock size={14} /> Timer
            </div>

            <div className="gap-4 grid grid-cols-3 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
              <TimeInput label="Focus" value={timerSettings.FOCUS} onChange={(v) => handleTimerChange({ ...timerSettings, FOCUS: v })} />
              <TimeInput label="Short Break" value={timerSettings.SHORT_BREAK} onChange={(v) => handleTimerChange({ ...timerSettings, SHORT_BREAK: v })} />
              <TimeInput label="Long Break" value={timerSettings.LONG_BREAK} onChange={(v) => handleTimerChange({ ...timerSettings, LONG_BREAK: v })} />
            </div>
          </section>

          {/* Shortcuts */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                <Keyboard size={14} /> Shortcuts
              </div>
              <button onClick={resetShortcuts} className="flex items-center gap-1 text-white/30 hover:text-white text-xs">
                <RotateCcw size={12} /> reset
              </button>
            </div>
            <div className="gap-3 grid grid-cols-2 bg-white/5 p-6 rounded-[2rem]">
              {Object.entries(customShortcuts).map(([action, key]) => (
                <div key={action} className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                  <span className="text-white/50 text-xs uppercase">{action}</span>
                  <button onClick={() => recordShortcut(action)} className="bg-white/10 px-3 py-1 rounded text-xs">
                    {activeShortcutKey === action ? '...' : key}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/30 text-xs uppercase">
              <Monitor size={14} /> Workflow
            </div>
            <div className="space-y-4 bg-white/5 p-6 rounded-[2rem]">
              <Switch checked={autoStartBreak} onChange={() => handleSettingChange('autoStartBreak', !autoStartBreak)} />
              <Switch checked={autoStartFocus} onChange={() => handleSettingChange('autoStartFocus', !autoStartFocus)} />
              <Switch checked={is24Hour} onChange={() => handleSettingChange('is24Hour', !is24Hour)} />
            </div>
          </section>

          {/* Appearance */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/30 text-xs uppercase">
              <Sun size={14} /> Appearance
            </div>
            <div className="space-y-6 bg-white/5 p-6 rounded-[2rem]">
              <input type="color" value={accentColor} onChange={(e) => handleSettingChange('accentColor', e.target.value)} />
              <input type="range" min="0" max="40" value={blurIntensity} onChange={(e) => handleSettingChange('blurIntensity', parseInt(e.target.value))} />
              <input type="text" value={bgImage} onChange={(e) => handleSettingChange('bgImage', e.target.value)} placeholder="Image URL" />
              <label className="flex justify-center items-center gap-2 border border-white/20 border-dashed rounded-xl h-12 cursor-pointer">
                <Upload size={16} /> Upload
                <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
              </label>
              {bgImage && <button onClick={() => handleSettingChange('bgImage', '')} className="flex items-center gap-2 text-red-500"><Trash2 size={16} /> Remove background</button>}
            </div>
          </section>

          {/* Sound */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/30 text-xs uppercase">
              <Volume2 size={14} /> Sound
            </div>
            <div className="space-y-4 bg-white/5 p-6 rounded-[2rem]">
              <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={(e) => setMasterVolume(parseFloat(e.target.value))} />
              <button onClick={playTestAlarm} className="flex justify-center items-center gap-2 bg-white/10 py-3 rounded-xl">
                <Bell size={14} /> Test Alarm
              </button>
            </div>
          </section>

        </div>

        <div className="mt-4 pt-6 border-white/10 border-t">
          <button onClick={handleSave} disabled={isSaving} style={{ backgroundColor: accentColor }} className="flex justify-center items-center gap-2 py-4 rounded-2xl w-full font-bold text-white text-xs uppercase">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> SAVE</>}
          </button>
        </div>

      </motion.div>
    </div>
  )
}

const TimeInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <input type="number" min="1" value={value} onChange={(e) => onChange(Number(e.target.value))} className="bg-black/40 px-2 py-3 rounded-xl text-white text-center" />
    <label className="text-[9px] text-white/40 text-center uppercase">{label}</label>
  </div>
)

const Switch = ({ checked, onChange }) => (
  <div onClick={onChange} className={`w-10 h-[22px] rounded-full relative cursor-pointer ${checked ? 'bg-purple-500' : 'bg-white/10'}`}>
    <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all ${checked ? 'left-[21px]' : 'left-[3px]'}`} />
  </div>
)

export default SettingsModal