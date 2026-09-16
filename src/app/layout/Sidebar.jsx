import React, { useCallback, useEffect, useMemo } from 'react';
import { Layout, Settings, Heart, Music, Keyboard, Gamepad2, BarChart2, Trophy, Blocks, X, Sun, Moon } from 'lucide-react';
import Tooltip from '../../shared/ui/overlay/Tooltip';
import LogoSVG from '@assets/pwa-192x192.svg';
import toast from 'react-hot-toast';
import { TEXTS } from '@/shared/constants/texts.constants';

const Sidebar = ({ onOpenSettings, onOpenSupport, onOpenMusic, onOpenGames, onOpenStats, onOpenAchievements, isMusicOpen, customShortcuts = {}, isMobileOpen = false, onCloseMobile, theme = 'dark', onToggleTheme }) => {
    const shortcuts = useMemo(() => ({ settings: 's', support: 'h', music: 'm', games: 'g', stats: 't', achievements: 'a', ...customShortcuts }), [customShortcuts]);
    const closeMobile = useCallback(() => onCloseMobile?.(), [onCloseMobile]);
    const runAndClose = useCallback((callback) => { callback?.(); closeMobile(); }, [closeMobile]);
    const handleUnderConstruction = useCallback((feature) => {
        toast(`The ${feature} module is coming soon!`, { icon: <Blocks size={15} style={{ color: 'var(--color-accent)' }} />, style: { borderRadius: '15px', background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });
        closeMobile();
    }, [closeMobile]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            const key = e.key?.toLowerCase();
            switch (key) {
                case shortcuts.settings: e.preventDefault(); onOpenSettings(); break;
                case shortcuts.support: e.preventDefault(); onOpenSupport(); break;
                case shortcuts.music: e.preventDefault(); onOpenMusic(); break;
                case shortcuts.games: e.preventDefault(); onOpenGames(); break;
                case shortcuts.stats: e.preventDefault(); onOpenStats(); break;
                case shortcuts.achievements: e.preventDefault(); onOpenAchievements(); break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, onOpenSettings, onOpenSupport, onOpenMusic, onOpenGames, onOpenStats, onOpenAchievements, handleUnderConstruction]);

    useEffect(() => {
        if (!isMobileOpen) return;
        const handleEscape = (event) => { if (event.key === 'Escape') closeMobile(); };
        window.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', handleEscape); document.body.style.overflow = ''; };
    }, [isMobileOpen, closeMobile]);

    const buttonStyle = 'p-2.5 2xl:p-3 text-white/50 lg:text-white/30 hover:text-accent transition-colors rounded-xl';
    const helpText = `${shortcuts.music.toUpperCase()}: Music | ${shortcuts.settings.toUpperCase()}: Settings`.trim();

    return (
        <>
            <button type="button" onClick={closeMobile} className={`lg:hidden z-[65] fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} aria-label="Close sidebar overlay" />
            <aside className={`z-[70] app-sidebar fixed lg:relative inset-y-0 left-0 flex flex-col items-center bg-black/45 lg:bg-black/20 backdrop-blur-xl py-7 lg:py-5 2xl:py-8 border-white/10 lg:border-white/5 border-r w-24 lg:w-20 2xl:w-24 h-dvh lg:h-full shrink-0 transition-transform duration-300 ease-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <button type="button" onClick={closeMobile} className="lg:hidden absolute top-3 right-3 flex justify-center items-center bg-white/10 border border-white/10 rounded-xl w-8 h-8 text-white/70" aria-label="Close sidebar"><X size={16} /></button>
                <div className="flex justify-center items-center bg-accent shadow-glow mb-10 lg:mb-8 2xl:mb-12 p-2 rounded-2xl w-12 lg:w-10 2xl:w-12 h-12 lg:h-10 2xl:h-12 overflow-hidden" style={{ backgroundColor: 'var(--color-accent)' }}>
                    <img src={LogoSVG} alt="Ataraxia Logo" className="w-full h-full object-contain" />
                </div>
                <nav className="flex flex-col flex-1 gap-7 lg:gap-5 2xl:gap-8">
                    <Tooltip text="Dashboard"><button type="button" onClick={closeMobile} className="bg-accent/10 shadow-glow p-2.5 2xl:p-3 rounded-xl text-accent" style={{ color: 'var(--color-accent)' }}><Layout size={22} /></button></Tooltip>
                    <Tooltip text={`${TEXTS.sidebar.music} (${shortcuts.music.toUpperCase()})`}>
                        <button type="button" onClick={() => runAndClose(onOpenMusic)} className={`p-2.5 2xl:p-3 transition-all rounded-xl ${isMusicOpen ? 'text-accent bg-accent/10 shadow-glow' : 'text-white/50 lg:text-white/30 hover:text-white'}`} style={isMusicOpen ? { color: 'var(--color-accent)', backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)' } : {}}><Music size={22} /></button>
                    </Tooltip>
                    <Tooltip text={`${TEXTS.sidebar.games} (${shortcuts.games.toUpperCase()})`}><button type="button" onClick={() => runAndClose(onOpenGames)} className={buttonStyle}><Gamepad2 size={22} /></button></Tooltip>
                    <Tooltip text={`${TEXTS.sidebar.stats} (${shortcuts.stats.toUpperCase()})`}><button type="button" onClick={() => runAndClose(onOpenStats)} className={buttonStyle}><BarChart2 size={22} /></button></Tooltip>
                    <Tooltip text={`${TEXTS.sidebar.achievements} (${shortcuts.achievements.toUpperCase()})`}><button type="button" onClick={() => runAndClose(onOpenAchievements)} className={buttonStyle}><Trophy size={22} /></button></Tooltip>
                </nav>
                <div className="flex flex-col gap-4 lg:gap-3 2xl:gap-4">
                    <Tooltip text={helpText}><div className="p-2.5 2xl:p-3 text-accent/40 hover:text-accent transition-colors cursor-help" style={{ color: 'rgba(var(--color-accent-rgb), 0.4)' }}><Keyboard size={22} /></div></Tooltip>
                    <Tooltip text={`Theme (${theme === 'dark' ? 'Light' : 'Dark'})`}>
                        <button type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => runAndClose(onToggleTheme)} className="p-2.5 2xl:p-3 text-white/50 lg:text-white/30 hover:text-accent transition-colors">
                            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                    </Tooltip>
                    <Tooltip text={`${TEXTS.sidebar.support} (${shortcuts.support.toUpperCase()})`}><button type="button" onClick={() => runAndClose(onOpenSupport)} className="p-2.5 2xl:p-3 text-white/50 lg:text-white/30 hover:text-accent transition-colors"><Heart size={22} /></button></Tooltip>
                    <Tooltip text={`${TEXTS.sidebar.settings} (${shortcuts.settings.toUpperCase()})`}><button type="button" onClick={() => runAndClose(onOpenSettings)} className="p-2.5 2xl:p-3 text-white/50 lg:text-white/30 hover:text-white hover:rotate-45 transition-all"><Settings size={22} /></button></Tooltip>
                </div>
            </aside>
        </>
    );
};
export default Sidebar;