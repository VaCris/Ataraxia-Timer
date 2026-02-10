import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Sun, Monitor, Upload, Volume2, Clock, User, LogOut, Save, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/auth-context';
import AuthForm from '../auth/AuthForm';

import { updateSettings, updateTimerSettings } from '../../store/slices/settingsSlice';

const SettingsModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const {
        timerSettings, autoStart, longBreakInterval,
        accentColor, bgImage, is24Hour, volume
    } = useSelector(state => state.settings);

    const { user, logout } = useAuth();
    const [authMode, setAuthMode] = useState('login');
    const hasOpenedRef = useRef(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            hasOpenedRef.current = true;
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleTimerChange = (newSettings) => dispatch(updateTimerSettings(newSettings));
    const handleAutoStartChange = (val) => dispatch(updateSettings({ autoStart: val }));
    const handleLongBreakChange = (val) => dispatch(updateSettings({ longBreakInterval: val }));
    const handleFormatChange = (val) => dispatch(updateSettings({ is24Hour: val }));
    const handleColorChange = (val) => dispatch(updateSettings({ accentColor: val }));
    const handleVolumeChange = (val) => dispatch(updateSettings({ volume: val }));
    const handleBgChange = (val) => dispatch(updateSettings({ bgImage: val }));

    const playTestAlarm = () => {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = volume;
        audio.play().catch(e => console.error("Audio failed", e));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <span style={{ fontWeight: 600 }}>Settings</span>
                    <button onClick={onClose} className="btn-icon"><X size={20} /></button>
                </div>

                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <div className="setting-section">
                        <div className="setting-label"><User size={14} /> Account</div>
                        {user && !user.isGuest ? (
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 500 }}>{user.name || 'Member'}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Pro</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px' }}>{user.email}</p>
                                <button onClick={logout} className="btn-upload" style={{ width: '100%', justifyContent: 'center', color: '#fca5a5' }}>
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <AuthForm
                                isLogin={authMode === 'login'}
                                onSuccess={() => toast.success('Logged in successfully!')}
                                toggleMode={() => setAuthMode(prev => prev === 'login' ? 'register' : 'login')}
                            />
                        )}
                    </div>
                    <div className="setting-section">
                        <div className="setting-label"><Clock size={14} /> Timer (min)</div>
                        <div className="time-grid">
                            <TimeInput label="Focus" value={timerSettings.work} onChange={(v) => handleTimerChange({ ...timerSettings, work: v })} />
                            <TimeInput label="Short" value={timerSettings.short} onChange={(v) => handleTimerChange({ ...timerSettings, short: v })} />
                            <TimeInput label="Long" value={timerSettings.long} onChange={(v) => handleTimerChange({ ...timerSettings, long: v })} />
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Monitor size={14} /> System</div>
                        <div className="setting-row"><span>Auto-start Cycles</span><Switch checked={autoStart} onChange={() => handleAutoStartChange(!autoStart)} /></div>
                        <div className="setting-row">
                            <span>Long Break Interval</span>
                            <input type="number" min="1" max="10" value={longBreakInterval} onChange={(e) => handleLongBreakChange(parseInt(e.target.value) || 1)} className="input-text-mini" />
                        </div>
                        <div className="setting-row"><span>24-Hour Clock</span><Switch checked={is24Hour} onChange={() => handleFormatChange(!is24Hour)} /></div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Sun size={14} /> Appearance</div>
                        <div className="setting-row">
                            <span>Theme Color</span>
                            <div className="color-picker-wrapper">
                                <div className="color-preview" style={{ backgroundColor: accentColor }}></div>
                                <input type="color" value={accentColor} onChange={(e) => handleColorChange(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="text" placeholder="Background Image URL..." className="input-text" value={bgImage && !bgImage.startsWith('data:') ? bgImage : ''} onChange={(e) => handleBgChange(e.target.value)} style={{ flex: 1 }} />
                                {bgImage && <button onClick={() => handleBgChange('')} className="btn-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}><Trash2 size={18} /></button>}
                            </div>
                            <label className="btn-upload"><Upload size={16} /> <span>Upload from Device</span><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onloadend = () => handleBgChange(r.result); r.readAsDataURL(f); } }} hidden /></label>
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Volume2 size={14} /> Sound & Volume</div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '16px' }}>
                                <Volume2 size={20} color="var(--text-muted)" />
                                <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} style={{ flex: 1, accentColor: accentColor || '#8b5cf6' }} />
                                <span style={{ minWidth: '40px', textAlign: 'right' }}>{Math.round(volume * 100)}%</span>
                            </div>
                            <button onClick={playTestAlarm} className="btn-upload" style={{ width: '100%', justifyContent: 'center' }}>Test Alarm Sound</button>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={onClose} className="btn-save" style={{ width: '100%', padding: '12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Save size={18} /> Done
                    </button>
                </div>
            </div>
            <style>{`
                .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.9rem; }
                .input-text-mini { width: 50px; text-align: center; padding: 4px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); border-radius: 6px; color: white; }
                .color-picker-wrapper { position: relative; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; overflow: hidden; }
                .color-picker-wrapper input { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; cursor: pointer; opacity: 0; }
                .color-preview { width: 100%; height: 100%; }
            `}</style>
        </div>
    );
};

const TimeInput = ({ label, value, onChange }) => {
    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '') { onChange(''); return; }
        const num = Number(val);
        if (!Number.isNaN(num)) onChange(label === "Focus" ? Math.max(1, Math.min(num, 120)) : Math.max(1, num));
    };
    return (
        <div className="time-box">
            <input type="number" min="1" value={value} max={label === "Focus" ? "120" : undefined} onChange={handleChange} onBlur={() => { if (value === '') onChange(1); }} className="input-text time-input" />
            <label className="time-label">{label}</label>
        </div>
    );
};

const Switch = ({ checked, onChange }) => (
    <div onClick={onChange} style={{ width: '40px', height: '22px', background: checked ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: checked ? '21px' : '3px', transition: 'left 0.2s' }} />
    </div>
);

export default SettingsModal;