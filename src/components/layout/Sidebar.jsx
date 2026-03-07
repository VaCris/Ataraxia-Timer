import React, { useEffect } from 'react';
import { Layout, Settings, Coffee, Heart, Music, Keyboard, Gamepad2, BarChart2, Trophy } from 'lucide-react';
import Tooltip from './Tooltip';
import { useMusic } from '@context/MusicContext';
import LogoSVG from '@assets/pwa-192x192.svg';

const Sidebar = ({ onOpenSettings, onOpenSupport, onOpenGames, onOpenStats, onOpenAchievements, customShortcuts = {} }) => {
    const { openModal, isModalOpen, closeModal } = useMusic();

    const shortcuts = {
        settings: 's',
        support: 'h',
        music: 'm',
        games: 'g',
        stats: 't',
        achievements: 'a',
        ...customShortcuts
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
                    if (isModalOpen) closeModal();
                    else openModal();
                    break;
                case shortcuts.games:
                    e.preventDefault();
                    onOpenGames();
                    break;
                case shortcuts.stats:
                    e.preventDefault();
                    onOpenStats();
                    break;
                case shortcuts.achievements:
                    e.preventDefault();
                    onOpenAchievements();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onOpenSettings, onOpenSupport, onOpenGames, onOpenStats, onOpenAchievements, isModalOpen, shortcuts]);

    const helpText = `
        ${shortcuts.music.toUpperCase()}: Music | 
        ${shortcuts.games.toUpperCase()}: Games | 
        ${shortcuts.stats.toUpperCase()}: Stats | 
        ${shortcuts.achievements.toUpperCase()}: Achievements | 
        ${shortcuts.settings.toUpperCase()}: Settings
    `.trim();

    return (
        <aside className="hidden z-50 relative md:flex flex-col items-center bg-black/20 backdrop-blur-xl py-8 border-white/5 border-r w-24 h-full shrink-0">
            <div className="flex justify-center items-center bg-accent shadow-glow mb-12 p-2 rounded-2xl w-12 h-12 overflow-hidden">
                <img src={LogoSVG} alt="Ataraxia Logo" className="w-full h-full object-contain" />
            </div>

            <nav className="flex flex-col flex-1 gap-8">
                <Tooltip text="Dashboard">
                    <button className="bg-accent/10 shadow-glow p-3 rounded-xl text-accent">
                        <Layout size={24} />
                    </button>
                </Tooltip>

                <Tooltip text={`Player (${shortcuts.music.toUpperCase()})`}>
                    <button onClick={openModal} className={`p-3 transition-all rounded-xl ${isModalOpen ? 'text-accent bg-accent/10 shadow-glow' : 'text-white/30 hover:text-white'}`}>
                        <Music size={24} />
                    </button>
                </Tooltip>

                <Tooltip text={`Games (${shortcuts.games.toUpperCase()})`}>
                    <button onClick={onOpenGames} className="p-3 border border-transparent hover:border-white/5 rounded-xl text-white/10 hover:text-accent/50 transition-all">
                        <Gamepad2 size={24} />
                    </button>
                </Tooltip>

                <Tooltip text={`Insights (${shortcuts.stats.toUpperCase()})`}>
                    <button onClick={onOpenStats} className="p-3 border border-transparent hover:border-white/5 rounded-xl text-white/10 hover:text-accent/50 transition-all">
                        <BarChart2 size={24} />
                    </button>
                </Tooltip>

                <Tooltip text={`Achievements (${shortcuts.achievements.toUpperCase()})`}>
                    <button onClick={onOpenAchievements} className="p-3 border border-transparent hover:border-white/5 rounded-xl text-white/10 hover:text-accent/50 transition-all">
                        <Trophy size={24} />
                    </button>
                </Tooltip>
            </nav>

            <div className="flex flex-col gap-4">
                <Tooltip text={helpText}>
                    <div className="p-3 text-accent/40 hover:text-accent transition-colors cursor-help">
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