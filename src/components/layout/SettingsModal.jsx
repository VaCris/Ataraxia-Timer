import React, { useState, useEffect, useRef } from 'react';
import { X, Sun, Monitor, Upload, Volume2, Clock, User, LogOut, Save } from 'lucide-react';
import { useAuth } from '../../context/auth-context';
import { settingsService } from '../../api/settings.service';
import { tagsService } from '../../api/tags.service';

const SettingsModal = ({
    isOpen, onClose,
    currentBg, onBgChange,
    accentColor, onColorChange,
    timerSettings, onTimerChange,
    autoStart, onAutoStartChange,
    longBreakInterval, onLongBreakIntervalChange,
    is24Hour, onFormatChange,
    volume, onVolumeChange
}) => {
    const { user, login, register, logout } = useAuth();

    const [authMode, setAuthMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const hasOpenedRef = useRef(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            hasOpenedRef.current = true;
        } else {
            document.body.style.overflow = 'unset';
            if (hasOpenedRef.current) {
                saveAll();
            }
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const saveTagColor = async () => {
        if (!user || user.isGuest) return;
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(accentColor)) return;

        try {
            const tags = await tagsService.getAll();
            const focusTag = tags.find(tag => tag.name === 'Focus');

            if (focusTag) {
                await tagsService.update(focusTag.id, {
                    color: accentColor
                });
            } else {
                await tagsService.create({
                    name: 'Focus',
                    color: accentColor
                });
            }
        } catch (error) {
            console.error('Failed to save tag color:', error);
        }
    };

    const saveSettings = async () => {
        if (!user || user.isGuest) return;

        const payload = {
            focusDuration: Number(timerSettings.work) || 1,
            shortBreakDuration: Number(timerSettings.short) || 1,
            longBreakDuration: Number(timerSettings.long) || 1,
            theme: 'default',
            soundEnabled: volume > 0
        };

        //console.log(payload);

        if (
            payload.focusDuration ||
            payload.shortBreakDuration ||
            payload.longBreakDuration ||
            payload.soundEnabled !== undefined
        ) {
            try {
                await settingsService.saveSettings(payload);
            } catch (err) {
                console.error('Failed to save settings:', err);
            }
        }
    };

    const saveAll = async () => {
        await Promise.all([
            saveSettings(),
            saveTagColor()
        ]);
    };

    const playTestAlarm = () => {
        try {
            const audio = new Audio('/sounds/alarm.mp3');
            audio.volume = volume;
            audio.play().catch(e => console.error("Audio play failed", e));
        } catch (error) {
            console.error("Audio error", error);
        }
    };

    if (!isOpen) return null;

    const handleAuth = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        let result;
        if (authMode === 'login') {
            result = await login(email, password);
        } else {
            result = await register(name, email, password);
        }

        setAuthLoading(false);
        if (!result.success) {
            setAuthError(result.message || 'Authentication failed');
        } else {
            setPassword('');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onBgChange(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <div className="modal-header">
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>Settings</span>
                    <button onClick={onClose} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>

                    <div className="setting-section">
                        <div className="setting-label"><User size={14} /> Account</div>

                        {user && user.email && !user.isGuest ? (
                            <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 500 }}>{user.name || 'User'}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '10px' }}>Pro</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 15px 0' }}>{user.email}</p>
                                <button
                                    onClick={logout}
                                    className="btn-upload"
                                    style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.4' }}>
                                    {authMode === 'login' ? 'Sign in to sync your stats.' : 'Create an account to save your progress.'}
                                </p>

                                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {authMode === 'register' && (
                                        <input
                                            type="text" placeholder="Name" className="input-text" required
                                            value={name} onChange={e => setName(e.target.value)}
                                        />
                                    )}
                                    <input
                                        type="email" placeholder="Email" className="input-text" required
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                    <input
                                        type="password" placeholder="Password" className="input-text" required
                                        value={password} onChange={e => setPassword(e.target.value)}
                                    />

                                    {authError && <span style={{ color: '#f87171', fontSize: '0.8rem' }}>{authError}</span>}

                                    <button type="submit" className="btn-upload" style={{ justifyContent: 'center', background: 'var(--primary-color)', borderColor: 'transparent', color: 'white' }} disabled={authLoading}>
                                        {authLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                                    </button>
                                </form>

                                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Clock size={14} /> Timer (min)</div>
                        <div className="time-grid">
                            <TimeInput label="Focus" value={timerSettings.work} onChange={(v) => onTimerChange({ ...timerSettings, work: v })} />
                            <TimeInput label="Short Break" value={timerSettings.short} onChange={(v) => onTimerChange({ ...timerSettings, short: v })} />
                            <TimeInput label="Long Break" value={timerSettings.long} onChange={(v) => onTimerChange({ ...timerSettings, long: v })} />
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Monitor size={14} /> System</div>
                        <div className="setting-row">
                            <span>Auto-start Cycles</span>
                            <Switch checked={autoStart} onChange={() => onAutoStartChange(!autoStart)} />
                        </div>
                        <div className="setting-row">
                            <span>Long Break Interval</span>
                            <input
                                type="number" min="1" max="10"
                                value={longBreakInterval}
                                onChange={(e) => onLongBreakIntervalChange(parseInt(e.target.value) || 1)}
                                className="input-text-mini"
                            />
                        </div>
                        <div className="setting-row">
                            <span>24-Hour Clock</span>
                            <Switch checked={is24Hour} onChange={() => onFormatChange(!is24Hour)} />
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Sun size={14} /> Appearance</div>
                        <div className="setting-row">
                            <span>Theme Color</span>
                            <div className="color-picker-wrapper">
                                <div className="color-preview" style={{ backgroundColor: accentColor }}></div>
                                <input type="color" value={accentColor} onChange={(e) => onColorChange(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                            <input
                                type="text" placeholder="Background Image URL..." className="input-text"
                                value={currentBg && !currentBg.startsWith('data:') ? currentBg : ''}
                                onChange={(e) => onBgChange(e.target.value)}
                            />
                            <label className="btn-upload">
                                <Upload size={16} /> <span>Upload from Device</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            </label>
                        </div>
                    </div>

                    <div className="setting-section">
                        <div className="setting-label"><Volume2 size={14} /> Sound & Volume</div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '16px' }}>
                                <Volume2 size={20} color="var(--text-muted)" />
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            cursor: 'pointer',
                                            accentColor: accentColor || '#8b5cf6',
                                            margin: 0
                                        }}
                                    />
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '40px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>

                            <button
                                onClick={playTestAlarm}
                                className="btn-upload"
                                style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,255,255,0.1)', fontWeight: 500 }}
                            >
                                Test Alarm Sound
                            </button>
                        </div>
                    </div>

                </div>

                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={saveAll}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'transform 0.1s'
                        }}
                    >
                        <Save size={18} /> Save Changes
                    </button>
                </div>

            </div>

            <style>{`
                .setting-row { display: flex; justifyContent: space-between; alignItems: center; margin-bottom: 12px; font-size: 0.9rem; }
                .input-text-mini { width: 50px; text-align: center; padding: 4px; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border); border-radius: 6px; color: white; }
                .color-picker-wrapper { position: relative; width: 24px; height: 24px; overflow: hidden; border-radius: 50%; border: 2px solid white; }
                .color-picker-wrapper input { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; cursor: pointer; opacity: 0; }
                .color-preview { width: 100%; height: 100%; }
            `}</style>
        </div>
    );
};

const TimeInput = ({ label, value, onChange }) => {
    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            onChange('');
            return;
        }
        const num = Number(val);
        if (!Number.isNaN(num) && num >= 0) {
            onChange(num);
        }
    };

    const handleBlur = () => {
        if (value === '') {
            onChange(1);
        }
    };

    return (
        <div className="time-box">
            <input
                type="number"
                min="1"
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className="input-text time-input"
            />
            <label className="time-label">{label}</label>
        </div>
    );
};

const Switch = ({ checked, onChange }) => (
    <div onClick={onChange} style={{
        width: '40px', height: '22px',
        background: checked ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
        borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
    }}>
        <div style={{
            width: '16px', height: '16px', background: 'white', borderRadius: '50%',
            position: 'absolute', top: '3px', left: checked ? '21px' : '3px',
            transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
    </div>
);

export default SettingsModal;