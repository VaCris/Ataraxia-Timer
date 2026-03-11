import React from 'react';
import { Layout, Music, Gamepad2, BarChart2, Trophy, Settings } from 'lucide-react';
import { useMusic } from '@context/MusicContext';

const BottomNav = ({ onOpenSettings, onOpenGames, onOpenStats, onOpenAchievements }) => {
    const { openModal, isModalOpen } = useMusic();

    const NavButton = ({ icon: Icon, onClick, active = false }) => (
        <button onClick={onClick} className={`flex flex-col items-center justify-center flex-1 py-3 transition-all ${active ? 'text-accent' : 'text-white/30 hover:text-white/60'}`}>
            <Icon size={24} className={active ? 'shadow-glow' : ''} />
        </button>
    );

    return (
        <nav className="lg:hidden right-0 bottom-0 left-0 z-[60] fixed flex justify-around items-center bg-surface/80 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl px-4 border-white/5 border-t h-20">
            <NavButton icon={Layout} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} active />
            <NavButton icon={Music} onClick={openModal} active={isModalOpen} />
            <NavButton icon={Gamepad2} onClick={onOpenGames} />
            <NavButton icon={BarChart2} onClick={onOpenStats} />
            <NavButton icon={Trophy} onClick={onOpenAchievements} />
            <NavButton icon={Settings} onClick={onOpenSettings} />
        </nav>
    );
};

export default BottomNav;