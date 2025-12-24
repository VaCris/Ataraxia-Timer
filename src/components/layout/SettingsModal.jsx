import { X, Image as ImageIcon, Link, Upload, Volume2, Palette, Clock } from 'lucide-react';

const SettingsModal = ({
    isOpen, onClose,
    currentBg, onBgChange,
    accentColor, onColorChange,
    timerSettings, onTimerChange
}) => {
    if (!isOpen) return null;

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            if (file.size > 5 * 1024 * 1024) return alert("Máximo 5MB");
            reader.onloadend = () => {
                onBgChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateTime = (key, value) => {
        onTimerChange({ ...timerSettings, [key]: value });
    };

    const testSound = () => {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = 0.5;
        audio.play();
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
                        <label className="setting-label"><Palette size={14} />Theme</label>
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
                        <label className="setting-label"><Clock size={14} />Duration (Min)</label>
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
                                <span className="time-label">Long Brea</span>
                            </div>
                        </div>
                    </div>

                    <div className="setting-section">
                        <label className="setting-label"><ImageIcon size={14} />Custom Backgrounds</label>
                        <input
                            type="text"
                            className="input-text"
                            placeholder="URL for background image..."
                            value={currentBg.startsWith('data:') ? '' : currentBg}
                            onChange={(e) => onBgChange(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />

                        <div className="upload-btn-wrapper">
                            <div className="btn-upload">
                                <Upload size={16} />Upload from PC
                            </div>
                            <input type="file" className="upload-input-real" accept="image/*" onChange={handleFileUpload} />
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
                        <label className="setting-label"><Volume2 size={14} />Alarm Sound</label>
                        <button className="btn-upload" onClick={testSound} style={{ textAlign: 'center', display: 'block' }}>
                            Check Sound
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsModal;