import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { X, Clock, Bell, Volume2, Zap, Eye, Upload, Trash2 } from 'lucide-react';
import { usePomodoro } from '@context/PomodoroContext';
import { useAudio } from '@context/AudioContext';
import { updateSettings } from '../../store/slices/settingsSlice';

const SettingsModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { state, dispatch: pomodoroDispatch } = usePomodoro();
    const { masterVolume, setMasterVolume, alarmVolume, setAlarmVolume } = useAudio();
    const { bgImage, blurIntensity, autoStartBreak, autoStartFocus } = useSelector(state => state.settings);

    if (!isOpen) return null;

    const handleSettingChange = (field, val) => dispatch(updateSettings({ [field]: val }));

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            handleSettingChange('bgImage', reader.result);
        };
        reader.readAsDataURL(file);
    };

    const playTestAlarm = () => {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = Number(masterVolume || 0.5) * Number(alarmVolume || 0.8);
        audio.play().catch(e => console.error(e));
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
                className="relative shadow-2xl p-8 md:p-12 border border-white/10 rounded-[3rem] w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar glass"
            >
                <div className="flex justify-between items-center mb-10">
                    <h2 className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                        <span className="text-accent">/</span> CONFIGURATION
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/5 p-3 rounded-full text-white/40 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-2 mb-6 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                            <Eye size={14} /> Aesthetics
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white/5 p-5 border border-white/5 rounded-[1.5rem]">
                                <span className="font-medium text-white/60 text-sm">Background Blur</span>
                                <input
                                    type="range" min="0" max="40" step="1"
                                    value={blurIntensity || 0}
                                    onChange={(e) => handleSettingChange('blurIntensity', parseInt(e.target.value))}
                                    className="bg-white/10 rounded-lg w-24 h-1 accent-accent appearance-none cursor-pointer"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text" placeholder="Paste Image URL (Unsplash, etc)..."
                                        className="flex-1 bg-black/40 px-4 py-4 border border-white/5 focus:border-accent/40 rounded-2xl outline-none text-xs transition-all"
                                        value={bgImage && !bgImage.startsWith('data:') ? bgImage : ''}
                                        onChange={(e) => handleSettingChange('bgImage', e.target.value)}
                                    />
                                    {bgImage && (
                                        <button onClick={() => handleSettingChange('bgImage', '')} className="bg-red-500/10 hover:bg-red-500/20 p-4 rounded-2xl text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <label className="flex justify-center items-center gap-3 bg-white/5 hover:bg-white/10 border-2 border-white/5 border-dashed rounded-2xl h-20 font-bold text-[10px] text-white/30 uppercase tracking-widest transition-all cursor-pointer">
                                    <Upload size={16} />
                                    <span>Upload from device</span>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
                                </label>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-6 font-bold text-[10px] text-white/30 uppercase tracking-[0.3em]">
                            <Volume2 size={14} /> Audio Studio
                        </div>
                        <div className="space-y-6 bg-white/5 p-6 border border-white/5 rounded-[2rem]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center px-1">
                                    <span className="font-bold text-[10px] text-white/40 uppercase">Master Volume</span>
                                    <span className="font-bold text-[10px] text-accent">{Math.round(masterVolume * 100)}%</span>
                                </div>
                                <input type="range" min="0" max="1" step="0.01" value={masterVolume} onChange={(e) => setMasterVolume(parseFloat(e.target.value))} className="bg-white/10 rounded-lg w-full h-1.5 accent-accent appearance-none cursor-pointer" />
                            </div>
                            <button onClick={playTestAlarm} className="flex justify-center items-center gap-2 hover:bg-white/5 py-4 border border-white/5 rounded-xl w-full font-bold text-[10px] text-white/40 uppercase tracking-widest transition-all">
                                <Bell size={12} /> Test Alarm Sound
                            </button>
                        </div>
                    </section>
                </div>

                <button onClick={onClose} className="bg-cream shadow-xl mt-12 py-5 rounded-2xl w-full font-black text-black tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                    SAVE CHANGES
                </button>
            </motion.div>
        </div>
    );
};

export default SettingsModal;