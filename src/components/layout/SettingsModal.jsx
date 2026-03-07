import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { X, Sun, Monitor, Upload, Volume2, Clock, Trash2, Save, Bell, Loader2, Keyboard, RotateCcw } from 'lucide-react';
import { useAudio } from '@context/AudioContext';
import { updateSettings, updateTimerSettings } from '@store/slices/settingsSlice';
import { useSettings as useApiSettings } from '@hooks/useSettings';

const SettingsModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { masterVolume, setMasterVolume, alarmVolume } = useAudio();
    const currentSettings = useSelector(state => state.settings);
    
    const {
        timerSettings = { FOCUS: 25, SHORT_BREAK: 5, LONG_BREAK: 15 },
        autoStartBreak,
        autoStartFocus,
        longBreakInterval,
        accentColor,
        bgImage,
        is24Hour,
        blurIntensity = 0,
        customShortcuts = {
            settings: 's',
            support: 'h',
            music: 'm',
            games: 'g',
            stats: 't',
            achievements: 'a'
        }
    } = currentSettings;

    const { updateSettings: saveToApi } = useApiSettings();
    const [isSaving, setIsSaving] = useState(false);
    const [activeShortcutKey, setActiveShortcutKey] = useState(null);

    if (!isOpen) return null;

    const handleTimerChange = (newSettings) => dispatch(updateTimerSettings(newSettings));
    const handleSettingChange = (field, val) => dispatch(updateSettings({ [field]: val }));

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => handleSettingChange('bgImage', reader.result);
        reader.readAsDataURL(file);
    };

    const playTestAlarm = () => {
        const audio = new Audio('/sounds/alarm-digital.mp3');
        audio.volume = Number(masterVolume || 0.5) * Number(alarmVolume || 0.8);
        audio.play().catch(e => console.error(e));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveToApi(currentSettings);
            onClose();
        } catch (error) {
            console.error("Error al guardar ajustes", error);
        } finally {
            setIsSaving(false);
        }
    };

    const recordShortcut = (action) => {
        setActiveShortcutKey(action);
        const listener = (e) => {
            e.preventDefault();
            const key = e.key.toLowerCase();
            if (key !== 'escape' && key.length === 1) {
                handleSettingChange('customShortcuts', {
                    ...customShortcuts,
                    [action]: key
                });
            }
            setActiveShortcutKey(null);
            window.removeEventListener('keydown', listener);
        };
        window.addEventListener('keydown', listener);
    };

    const resetShortcuts = () => {
        handleSettingChange('customShortcuts', {
            settings: 's',
            support: 'h',
            music: 'm',
            games: 'g',
            stats: 't',
            achievements: 'a'
        });
    };

    return (
        <div className="z-[100] fixed inset-0 flex justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative flex flex-col shadow-2xl p-6 md:p-8 border border-white/10 rounded-[3rem] w-full max-w-lg max-h-[90vh] overflow-hidden glass"
            >
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                        <span className="text-accent" style={{ color: accentColor }}>/</span> CONFIGURATION
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/5 p-3 rounded-full text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 space-y-10 pr-2 pb-4 overflow-y-auto custom-scrollbar">
                    <section>
                        <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                            <Clock size={14} /> Timer (Minutes)
                        </div>
                        <div className="gap-4 grid grid-cols-3 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
                            <TimeInput label="Focus" value={timerSettings.FOCUS} onChange={(v) => handleTimerChange({ ...timerSettings, FOCUS: v })} accent={accentColor} />
                            <TimeInput label="Short Break" value={timerSettings.SHORT_BREAK} onChange={(v) => handleTimerChange({ ...timerSettings, SHORT_BREAK: v })} accent={accentColor} />
                            <TimeInput label="Long Break" value={timerSettings.LONG_BREAK} onChange={(v) => handleTimerChange({ ...timerSettings, LONG_BREAK: v })} accent={accentColor} />
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                                <Keyboard size={14} /> Keyboard Shortcuts
                            </div>
                            <button onClick={resetShortcuts} className="flex items-center gap-1 font-black text-[9px] text-white/20 hover:text-accent uppercase transition-colors">
                                <RotateCcw size={10} /> Reset
                            </button>
                        </div>
                        <div className="gap-3 grid grid-cols-2 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
                            {Object.entries(customShortcuts).map(([action, key]) => (
                                <div key={action} className="flex justify-between items-center bg-black/20 p-3 border border-white/5 rounded-xl">
                                    <span className="font-bold text-[10px] text-white/40 uppercase tracking-wider">{action}</span>
                                    <button 
                                        onClick={() => recordShortcut(action)}
                                        className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg font-black text-xs uppercase border transition-all ${activeShortcutKey === action ? 'bg-accent border-accent text-white animate-pulse' : 'bg-white/5 border-white/10 text-accent'}`}
                                        style={{ color: activeShortcutKey === action ? '#fff' : accentColor, borderColor: activeShortcutKey === action ? accentColor : 'rgba(255,255,255,0.1)' }}
                                    >
                                        {activeShortcutKey === action ? '...' : key}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                            <Monitor size={14} /> System Workflow
                        </div>
                        <div className="space-y-4 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
                            <div className="flex justify-between items-center font-medium text-white/80 text-sm">
                                <span>Auto-start Breaks</span>
                                <Switch checked={autoStartBreak} onChange={() => handleSettingChange('autoStartBreak', !autoStartBreak)} accent={accentColor} />
                            </div>
                            <div className="flex justify-between items-center font-medium text-white/80 text-sm">
                                <span>Auto-start Cycles</span>
                                <Switch checked={autoStartFocus} onChange={() => handleSettingChange('autoStartFocus', !autoStartFocus)} accent={accentColor} />
                            </div>
                            <div className="flex justify-between items-center font-medium text-white/80 text-sm">
                                <span>Long Break Interval</span>
                                <input
                                    type="number" min="1" max="10"
                                    value={longBreakInterval || 4}
                                    onChange={(e) => handleSettingChange('longBreakInterval', parseInt(e.target.value) || 1)}
                                    className="bg-black/40 px-2 py-1.5 border border-white/10 focus:border-accent/50 rounded-xl outline-none w-16 text-white text-center transition-all"
                                    style={{ borderColor: accentColor ? `${accentColor}50` : undefined }}
                                />
                            </div>
                            <div className="flex justify-between items-center font-medium text-white/80 text-sm">
                                <span>24-Hour Clock</span>
                                <Switch checked={is24Hour} onChange={() => handleSettingChange('is24Hour', !is24Hour)} accent={accentColor} />
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                            <Sun size={14} /> Appearance
                        </div>
                        <div className="space-y-6 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
                            <div className="flex justify-between items-center font-medium text-white/80 text-sm">
                                <span>Theme Color</span>
                                <div className="relative shadow-glow border-2 border-white/20 hover:border-white rounded-full w-8 h-8 overflow-hidden transition-all" style={{ boxShadow: `0 0 15px ${accentColor}40` }}>
                                    <div className="w-full h-full" style={{ backgroundColor: accentColor || '#8b5cf6' }}></div>
                                    <input type="color" value={accentColor || '#8b5cf6'} onChange={(e) => handleSettingChange('accentColor', e.target.value)} className="-top-1/2 -left-1/2 absolute opacity-0 w-[200%] h-[200%] cursor-pointer" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center font-medium text-white/80 text-sm">
                                <span>Background Blur</span>
                                <input
                                    type="range" min="0" max="40" step="1"
                                    value={blurIntensity || 0}
                                    onChange={(e) => handleSettingChange('blurIntensity', parseInt(e.target.value))}
                                    className="bg-white/10 rounded-lg w-24 h-1.5 appearance-none cursor-pointer"
                                    style={{ accentColor: accentColor || '#8b5cf6' }}
                                />
                            </div>
                            <div className="space-y-4 pt-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text" placeholder="Paste Image URL..."
                                        className="flex-1 bg-black/40 px-4 py-3 border border-white/5 focus:border-accent/40 rounded-2xl outline-none text-xs transition-all"
                                        value={bgImage && !bgImage.startsWith('data:') ? bgImage : ''}
                                        onChange={(e) => handleSettingChange('bgImage', e.target.value)}
                                        style={{ borderColor: accentColor ? `${accentColor}40` : undefined }}
                                    />
                                    {bgImage && (
                                        <button onClick={() => handleSettingChange('bgImage', '')} className="bg-red-500/10 hover:bg-red-500/20 p-3 rounded-2xl text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <label className="flex justify-center items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 border-dashed rounded-2xl h-14 font-bold text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-all cursor-pointer">
                                    <Upload size={16} />
                                    <span>Upload from device</span>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                                </label>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                            <Volume2 size={14} /> Sound & Volume
                        </div>
                        <div className="space-y-6 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="font-bold text-[10px] text-white/40 uppercase tracking-widest">Master Volume</span>
                                    <span className="font-bold text-[10px]" style={{ color: accentColor || '#8b5cf6' }}>{Math.round((masterVolume || 0) * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="1" step="0.01"
                                    value={masterVolume || 0}
                                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                    className="bg-white/10 rounded-lg w-full h-1.5 appearance-none cursor-pointer"
                                    style={{ accentColor: accentColor || '#8b5cf6' }}
                                />
                            </div>
                            <button onClick={playTestAlarm} className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 py-4 border border-white/10 rounded-xl w-full font-bold text-[10px] text-white/60 hover:text-white uppercase tracking-widest transition-all">
                                <Bell size={14} /> Test Alarm Sound
                            </button>
                        </div>
                    </section>
                </div>

                <div className="mt-4 pt-6 border-white/10 border-t shrink-0">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{ backgroundColor: accentColor || '#8b5cf6' }}
                        className="flex justify-center items-center gap-2 disabled:opacity-50 shadow-glow py-4 rounded-2xl w-full font-black text-white text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 disabled:hover:scale-100 transition-all"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> SAVE CHANGES</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const TimeInput = ({ label, value, onChange, accent }) => {
    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '') { onChange(''); return; }
        const num = Number(val);
        if (!Number.isNaN(num)) onChange(label === "Focus" ? Math.max(1, Math.min(num, 120)) : Math.max(1, num));
    };
    return (
        <div className="flex flex-col gap-2">
            <input
                type="number" min="1" value={value} max={label === "Focus" ? "120" : undefined}
                onChange={handleChange} onBlur={() => { if (value === '') onChange(1); }}
                className="bg-black/40 px-2 py-3 border border-white/10 focus:border-accent rounded-xl outline-none w-full font-medium text-white text-lg text-center transition-all"
                style={{ caretColor: accent || '#8b5cf6' }}
            />
            <label className="font-bold text-[9px] text-white/40 text-center uppercase leading-tight tracking-widest">
                {label}
            </label>
        </div>
    );
};

const Switch = ({ checked, onChange, accent }) => (
    <div onClick={onChange} className={`w-10 h-[22px] rounded-full relative cursor-pointer transition-colors duration-200 ${checked ? '' : 'bg-white/10'}`} style={{ backgroundColor: checked ? (accent || '#8b5cf6') : undefined }}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-[3px] transition-all duration-200 shadow-sm ${checked ? 'left-[21px]' : 'left-[3px]'}`} />
    </div>
);

export default SettingsModal;