import React, { useEffect } from 'react';
import { Layout, Settings, Coffee, Heart, Music, Keyboard, Gamepad2, BarChart2, Trophy,Blocks } from 'lucide-react';
import Tooltip from '../../shared/ui/overlay/Tooltip';
import LogoSVG from '@assets/pwa-192x192.svg';
import toast from 'react-hot-toast';

const Sidebar = ({
    onOpenSettings,
    onOpenSupport,
    onOpenGames,
    onOpenStats,
    onOpenAchievements,
    onOpenMusic,
    isMusicOpen,
    customShortcuts = {}
}) => {

    const shortcuts = {
        settings: 's',
        support: 'h',
        music: 'm',
        games: 'g',
        stats: 't',
        achievements: 'a',
        ...customShortcuts
    };

    const handleUnderConstruction = (feature) => {
        toast(`The ${feature} module is coming soon!`, {
            icon: <Blocks size={15} style={{ color: 'var(--color-accent)' }} />,
            style: {
                borderRadius: '15px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            },
        });
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            const key = e.key?.toLowerCase();

            switch (key) {
                case shortcuts.settings:
                    e.preventDefault();
                    onOpenSettings();
                    break;
                case shortcuts.support:
                    e.preventDefault();
                    onOpenSupport();
                    break;
                case shortcuts.music:
                    e.preventDefault();
                    onOpenMusic();
                    break;
                case shortcuts.games:
                    e.preventDefault(); handleUnderConstruction('Games'); break;
                case shortcuts.stats:
                    e.preventDefault(); handleUnderConstruction('Insights'); break;
                case shortcuts.achievements:
                    e.preventDefault(); handleUnderConstruction('Achievements'); break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onOpenSettings, onOpenSupport, onOpenGames, onOpenStats, onOpenAchievements, onOpenMusic, shortcuts]);

    const disabledButtonStyle = "p-3 rounded-xl text-white/5 cursor-not-allowed grayscale transition-all";

    const helpText = `
        ${shortcuts.music.toUpperCase()}: Music | 
        ${shortcuts.settings.toUpperCase()}: Settings
    `.trim();

    return (
        <aside className="hidden z-50 relative md:flex flex-col items-center bg-black/20 backdrop-blur-xl py-8 border-white/5 border-r w-24 h-full shrink-0">
            <div className="flex justify-center items-center bg-accent shadow-glow mb-12 p-2 rounded-2xl w-12 h-12 overflow-hidden" style={{ backgroundColor: 'var(--color-accent)' }}>
                <img src={LogoSVG} alt="Ataraxia Logo" className="w-full h-full object-contain" />
            </div>

            <nav className="flex flex-col flex-1 gap-8">
                <Tooltip text="Dashboard">
                    <button className="bg-accent/10 shadow-glow p-3 rounded-xl text-accent" style={{ color: 'var(--color-accent)' }}>
                        <Layout size={24} />
                    </button>
                </Tooltip>

                <Tooltip text={`Player (${shortcuts.music.toUpperCase()})`}>
                    <button
                        onClick={onOpenMusic}
                        className={`p-3 transition-all rounded-xl ${isMusicOpen ? 'text-accent bg-accent/10 shadow-glow' : 'text-white/30 hover:text-white'}`}
                        style={isMusicOpen ? { color: 'var(--color-accent)', backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)' } : {}}
                    >
                        <Music size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Coming Soon (Games)">
                    <button 
                        onClick={() => handleUnderConstruction('Games')} 
                        className={disabledButtonStyle}
                    >
                        <Gamepad2 size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Coming Soon (Insights)">
                    <button 
                        onClick={() => handleUnderConstruction('Insights')} 
                        className={disabledButtonStyle}
                    >
                        <BarChart2 size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Coming Soon (Achievements)">
                    <button 
                        onClick={() => handleUnderConstruction('Achievements')} 
                        className={disabledButtonStyle}
                    >
                        <Trophy size={24} />
                    </button>
                </Tooltip>
            </nav>

            <div className="flex flex-col gap-4">
                <Tooltip text={helpText}>
                    <div className="p-3 text-accent/40 hover:text-accent transition-colors cursor-help" style={{ color: 'rgba(var(--color-accent-rgb), 0.4)' }}>
                        <Keyboard size={24} />
                    </div>
                </Tooltip>
                <Tooltip text={`Support (${shortcuts.support.toUpperCase()})`}>
                    <button onClick={onOpenSupport} className="p-3 text-white/30 hover:text-accent transition-colors">
                        <Heart size={24} />
                    </button>
                </Tooltip>
                <Tooltip text={`Settings (${shortcuts.settings.toUpperCase()})`}>
                    <button onClick={onOpenSettings} className="p-3 text-white/30 hover:text-white hover:rotate-45 transition-all">
                        <Settings size={24} />
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
};

export default Sidebar;