import React, { useCallback, useEffect, useMemo } from 'react';
import {
    Layout,
    Settings,
    Heart,
    Music,
    Keyboard,
    Gamepad2,
    BarChart2,
    Trophy,
    Blocks,
    X,
} from 'lucide-react';
import Tooltip from '../../shared/ui/overlay/Tooltip';
import LogoSVG from '@assets/pwa-192x192.svg';
import toast from 'react-hot-toast';

const Sidebar = ({
    onOpenSettings,
    onOpenSupport,
    onOpenMusic,
    isMusicOpen,
    customShortcuts = {},
    isMobileOpen = false,
    onCloseMobile,
}) => {
    const shortcuts = useMemo(
        () => ({
            settings: 's',
            support: 'h',
            music: 'm',
            games: 'g',
            stats: 't',
            achievements: 'a',
            ...customShortcuts,
        }),
        [customShortcuts]
    );

    const closeMobile = useCallback(() => {
        onCloseMobile?.();
    }, [onCloseMobile]);

    const runAndClose = useCallback(
        (callback) => {
            callback?.();
            closeMobile();
        },
        [closeMobile]
    );

    const handleUnderConstruction = useCallback((feature) => {
        toast(`The ${feature} module is coming soon!`, {
            icon: <Blocks size={15} style={{ color: 'var(--color-accent)' }} />,
            style: {
                borderRadius: '15px',
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
            },
        });

        closeMobile();
    }, [closeMobile]);

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
                    e.preventDefault();
                    handleUnderConstruction('Games');
                    break;
                case shortcuts.stats:
                    e.preventDefault();
                    handleUnderConstruction('Insights');
                    break;
                case shortcuts.achievements:
                    e.preventDefault();
                    handleUnderConstruction('Achievements');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [
        shortcuts,
        onOpenSettings,
        onOpenSupport,
        onOpenMusic,
        handleUnderConstruction,
    ]);

    useEffect(() => {
        if (!isMobileOpen) return;

        const handleEscape = (event) => {
            if (event.key === 'Escape') closeMobile();
        };

        window.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isMobileOpen, closeMobile]);

    const disabledButtonStyle =
        'p-3 rounded-xl text-white/20 md:text-white/5 cursor-not-allowed grayscale transition-all';

    const helpText = `
        ${shortcuts.music.toUpperCase()}: Music | 
        ${shortcuts.settings.toUpperCase()}: Settings
    `.trim();

    return (
        <>
            <button
                type="button"
                onClick={closeMobile}
                className={`md:hidden z-[65] fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                    }`}
                aria-label="Close sidebar overlay"
            />

            <aside
                className={`z-[70] fixed md:relative inset-y-0 left-0 flex flex-col items-center bg-black/45 md:bg-black/20 backdrop-blur-xl py-7 md:py-8 border-white/10 md:border-white/5 border-r w-24 h-dvh md:h-full shrink-0 transition-transform duration-300 ease-out ${isMobileOpen
                    ? 'translate-x-0'
                    : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <button
                    type="button"
                    onClick={closeMobile}
                    className="md:hidden absolute top-3 right-3 flex justify-center items-center bg-white/10 border border-white/10 rounded-xl w-8 h-8 text-white/70"
                    aria-label="Close sidebar"
                >
                    <X size={16} />
                </button>

                <div
                    className="flex justify-center items-center bg-accent shadow-glow mb-10 md:mb-12 p-2 rounded-2xl w-12 h-12 overflow-hidden"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                >
                    <img
                        src={LogoSVG}
                        alt="Ataraxia Logo"
                        className="w-full h-full object-contain"
                    />
                </div>

                <nav className="flex flex-col flex-1 gap-7 md:gap-8">
                    <Tooltip text="Dashboard">
                        <button
                            type="button"
                            onClick={closeMobile}
                            className="bg-accent/10 shadow-glow p-3 rounded-xl text-accent"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            <Layout size={24} />
                        </button>
                    </Tooltip>

                    <Tooltip text={`Player (${shortcuts.music.toUpperCase()})`}>
                        <button
                            type="button"
                            onClick={() => runAndClose(onOpenMusic)}
                            className={`p-3 transition-all rounded-xl ${isMusicOpen
                                ? 'text-accent bg-accent/10 shadow-glow'
                                : 'text-white/50 md:text-white/30 hover:text-white'
                                }`}
                            style={
                                isMusicOpen
                                    ? {
                                        color: 'var(--color-accent)',
                                        backgroundColor:
                                            'rgba(var(--color-accent-rgb), 0.1)',
                                    }
                                    : {}
                            }
                        >
                            <Music size={24} />
                        </button>
                    </Tooltip>

                    <Tooltip text="Coming Soon (Games)">
                        <button
                            type="button"
                            onClick={() => handleUnderConstruction('Games')}
                            className={disabledButtonStyle}
                        >
                            <Gamepad2 size={24} />
                        </button>
                    </Tooltip>

                    <Tooltip text="Coming Soon (Insights)">
                        <button
                            type="button"
                            onClick={() => handleUnderConstruction('Insights')}
                            className={disabledButtonStyle}
                        >
                            <BarChart2 size={24} />
                        </button>
                    </Tooltip>

                    <Tooltip text="Coming Soon (Achievements)">
                        <button
                            type="button"
                            onClick={() => handleUnderConstruction('Achievements')}
                            className={disabledButtonStyle}
                        >
                            <Trophy size={24} />
                        </button>
                    </Tooltip>
                </nav>

                <div className="flex flex-col gap-4">
                    <Tooltip text={helpText}>
                        <div
                            className="p-3 text-accent/40 hover:text-accent transition-colors cursor-help"
                            style={{ color: 'rgba(var(--color-accent-rgb), 0.4)' }}
                        >
                            <Keyboard size={24} />
                        </div>
                    </Tooltip>

                    <Tooltip text={`Support (${shortcuts.support.toUpperCase()})`}>
                        <button
                            type="button"
                            onClick={() => runAndClose(onOpenSupport)}
                            className="p-3 text-white/50 md:text-white/30 hover:text-accent transition-colors"
                        >
                            <Heart size={24} />
                        </button>
                    </Tooltip>

                    <Tooltip text={`Settings (${shortcuts.settings.toUpperCase()})`}>
                        <button
                            type="button"
                            onClick={() => runAndClose(onOpenSettings)}
                            className="p-3 text-white/50 md:text-white/30 hover:text-white hover:rotate-45 transition-all"
                        >
                            <Settings size={24} />
                        </button>
                    </Tooltip>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
