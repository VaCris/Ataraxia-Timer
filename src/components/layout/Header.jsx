import { useState, useEffect } from 'react';
import { Zap, Clock } from 'lucide-react';

const Header = ({ is24Hour }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !is24Hour
  });

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0', width: '100%', maxWidth: '1200px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ padding: '6px', borderRadius: '8px', display: 'flex' }}>
          <Zap size={18} color="white" fill="white" />
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Zenith Timer</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.05)',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid var(--glass-border)'
        }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums', minWidth: '65px', textAlign: 'center' }}>
            {formattedTime}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;