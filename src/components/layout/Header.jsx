import { Zap, Settings } from 'lucide-react';

const Header = ({ onOpenSettings }) => (
  <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem 2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 ,left:'350px'}}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ background: 'var(--primary-purple)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
        <Zap size={18} color="white" fill="#EDE8D0" />
      </div>
      <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Zenith Timer</h1>
    </div>

    <button
      onClick={onOpenSettings}
      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
    >
      <Settings size={20} />
    </button>
  </header>
);

export default Header;