import React from 'react';
import { X, Image as ImageIcon, Upload, Volume2, Palette, Clock, Zap, Repeat, Monitor, Volume1 } from 'lucide-react';

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
    if (!isOpen) return null;

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            return alert("Image is too large (Max 3MB). Please choose a smaller one.");
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                onBgChange(reader.result);
            } catch (error) {
                alert("Storage full! Try a smaller image or remove old data.");
                console.error("Quota exceeded", error);
            }
        };
        reader.readAsDataURL(file);
    };

    const updateTime = (key, value) => {
        onTimerChange({ ...timerSettings, [key]: value });
    };

    const testSound = () => {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = volume;
        audio.play().catch(e => console.log(e));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">

                <div className="modal-header">
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Settings</h3>
                    <button onClick={onClose} className="btn-icon"><X size={20} /></button>
                </div>

                <div className="modal-body">

                    <div className="setting-section">
                        <label className="setting-label"><Monitor size={14} /> System</label>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <span style={{ fontSize: '0.9rem' }}>24-Hour Clock</span>
                            <input
                                type="checkbox"
                                checked={is24Hour}
                                onChange={(e) => onFormatChange(e.target.checked)}
                                style={{
                                    width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary-color)'
                                }}
                            />
                        </div>
                    </div>

                    <div className="setting-section">
                        <label className="setting-label"><Zap size={14} /> Automation</label>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)',
                            marginBottom: '10px'
                        }}>
                            <span style={{ fontSize: '0.9rem' }}>Auto-start Cycles</span>
                            <input
                                type="checkbox"
                                checked={autoStart}
                                onChange={(e) => onAutoStartChange(e.target.checked)}
                                style={{
                                    width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary-color)'
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Repeat size={16} color="var(--text-muted)" />
                                <span style={{ fontSize: '0.85rem' }}>Long Break Interval</span>
                            </div>
                            <input
                                type="number"
                                min="1"
                                max="99"
                                value={longBreakInterval}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') onLongBreakIntervalChange('');
                                    else onLongBreakIntervalChange(Number(val));
                                }}
                                onBlur={() => {
                                    if (!longBreakInterval || longBreakInterval < 1) onLongBreakIntervalChange(4);
                                }}
                                className="input-text"
                                style={{ width: '60px', textAlign: 'center' }}
                            />
                        </div>
                    </div>

                    <div className="setting-section">
                        <label className="setting-label"><Palette size={14} /> Theme Color</label>
                        <div className="color-picker-container">
                            <div className="color-preview" style={{ backgroundColor: accentColor }}></div>
                            <input
                                type="color"
                                className="color-input-real"
                                value={accentColor}
                                onChange={(e) => onColorChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="setting-section">
                        <label className="setting-label"><Clock size={14} /> Duration (Min)</label>
                        <div className="time-grid">
                            <div className="time-box">
                                <input type="number" className="input-text time-input"
                                    value={timerSettings.work} onChange={(e) => updateTime('work', e.target.value)} />
                                <span className="time-label">Deep Work</span>
                            </div>
                            <div className="time-box">
                                <input type="number" className="input-text time-input"
                                    value={timerSettings.short} onChange={(e) => updateTime('short', e.target.value)} />
                                <span className="time-label">Short Break</span>
                            </div>
                            <div className="time-box">
                                <input type="number" className="input-text time-input"
                                    value={timerSettings.long} onChange={(e) => updateTime('long', e.target.value)} />
                                <span className="time-label">Long Break</span>
                            </div>
                        </div>
                    </div>

                    <div className="setting-section">
                        <label className="setting-label"><ImageIcon size={14} /> Background</label>
                        <input
                            type="text"
                            className="input-text"
                            placeholder="Paste image URL..."
                            value={currentBg.startsWith('data:') ? '' : currentBg}
                            onChange={(e) => onBgChange(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />

                        <div className="upload-btn-wrapper">
                            <label className="btn-upload" style={{ cursor: 'pointer' }}>
                                <Upload size={16} /> Upload from PC
                                <input
                                    type="file"
                                    className="upload-input-real"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        {currentBg && (
                            <button
                                onClick={() => onBgChange('')}
                                style={{
                                    marginTop: '10px',
                                    background: 'rgba(255, 59, 48, 0.1)',
                                    color: '#ff3b30',
                                    border: '1px solid rgba(255, 59, 48, 0.3)',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    width: '100%',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                Remove Background
                            </button>
                        )}
                    </div>

                    <div className="setting-section" style={{ marginBottom: 0 }}>
                        <label className="setting-label"><Volume2 size={14} /> Sound & Volume</label>

                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '15px',
                            borderRadius: '10px',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Volume1 size={16} color="var(--text-muted)" />
                                <input
                                    type="range"
                                    min="0" max="1" step="0.05"
                                    value={volume}
                                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                    style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.8rem', width: '30px', textAlign: 'right' }}>
                                    {Math.round(volume * 100)}%
                                </span>
                            </div>

                            <button className="btn-upload" onClick={testSound} style={{ textAlign: 'center', width: '100%' }}>
                                Test Alarm
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;