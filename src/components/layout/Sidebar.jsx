import React, { useEffect } from 'react';
import { Layout, Settings, Coffee, Heart, Music, Keyboard, Gamepad2, BarChart2, Trophy } from 'lucide-react';
import Tooltip from './Tooltip';
import { useMusic } from '@context/MusicContext';

const Sidebar = ({ onOpenSettings, onOpenSupport, onOpenGames, onOpenStats, onOpenAchievements }) => {
    const { openModal, isModalOpen, closeModal } = useMusic();
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                const key = e.key?.toLowerCase();

                if (key === 's') {
                    e.preventDefault();
                    onOpenSettings();
                } else if (key === 'h') {
                    e.preventDefault();
                    onOpenSupport();
                } else if (key === 'm') {
                    e.preventDefault();
                    if (isModalOpen) closeModal();
                    else openModal();
                } else if (key === 'g') {
                    e.preventDefault();
                    onOpenGames();
                } else if (key === 't') {
                    e.preventDefault();
                    onOpenStats();
                } else if (key === 'a') {
                    e.preventDefault();
                    onOpenAchievements();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onOpenSettings, onOpenSupport, onOpenGames, onOpenStats, onOpenAchievements, isModalOpen]);

    return (
        <aside className="hidden z-50 relative md:flex flex-col items-center bg-black/20 backdrop-blur-xl py-8 border-white/5 border-r w-24 h-full shrink-0">
            <div className="flex justify-center items-center bg-accent shadow-glow mb-12 rounded-2xl w-12 h-12 text-white">
                <Coffee size={24} strokeWidth={2.5} />
            </div>

            <nav className="flex flex-col flex-1 gap-8">
                <Tooltip text="Dashboard">
                    <button className="bg-accent/10 p-3 rounded-xl text-accent">
                        <Layout size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Player (M)">
                    <button
                        onClick={openModal}
                        className={`p-3 transition-all rounded-xl ${isModalOpen ? 'text-accent bg-accent/10 shadow-glow' : 'text-white/30 hover:text-white'}`}
                    >
                        <Music size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Games (G) - Coming Soon">
                    <button
                        onClick={onOpenGames}
                        className="p-3 border border-transparent hover:border-white/5 rounded-xl text-white/10 hover:text-accent/50 transition-all"
                    >
                        <Gamepad2 size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Insights (T) - Coming Soon">
                    <button
                        onClick={onOpenGames}
                        className="p-3 border border-transparent hover:border-white/5 rounded-xl text-white/10 hover:text-accent/50 transition-all"
                    >
                        <BarChart2 size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Achievements (A) - Coming Soon">
                    <button
                        onClick={onOpenAchievements}
                        className="p-3 border border-transparent hover:border-white/5 rounded-xl text-white/10 hover:text-accent/50 transition-all"
                    >
                        <Trophy size={24} />
                    </button>
                </Tooltip>
            </nav>

            <div className="flex flex-col gap-4">
                <Tooltip text="M: Music | G: Games | T: Stats | A: Achievements | S: Settings">
                    <div className="p-3 text-accent/40 cursor-help">
                        <Keyboard size={24} />
                    </div>
                </Tooltip>

                <Tooltip text="Support (H)">
                    <button onClick={onOpenSupport} className="p-3 text-white/30 hover:text-accent transition-colors">
                        <Heart size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Settings (S)">
                    <button onClick={onOpenSettings} className="p-3 text-white/30 hover:text-white hover:rotate-45 transition-all">
                        <Settings size={24} />
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
};

export default Sidebar;