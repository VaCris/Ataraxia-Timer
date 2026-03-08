import React, { useState, useEffect, Suspense } from 'react';
import { User, Bell, BellOff, LogOut, Clock, Download } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useNotifications } from '@hooks/useNotifications';
import { useInstallPrompt } from '@hooks/useInstallPrompt';
import { useSelector } from 'react-redux';

const AuthModal = React.lazy(() => import('@components/modals/AuthModal'));

const Header = () => {
    const { user, logout } = useAuth();
    const { permission, requestPermission } = useNotifications();
    const { isInstallable, handleInstallClick } = useInstallPrompt();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const is24Hour = useSelector(state => state.settings.is24Hour);
    const accentColor = useSelector(state => state.settings.accentColor);
    const isRealUser = user && !user.isGuest;
    const isGranted = permission === 'granted';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: !is24Hour
        });
    };

    const validUsername = (() => {
        const name = user?.username || user?.name;
        if (!name || name.includes('@')) return null;
        return name;
    })();

    return (
        <header className="flex justify-between items-center px-8 py-6 w-full">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <h1 className="font-black text-white text-2xl italic tracking-tighter">
                            ATARAXIA
                        </h1>
                        <div
                            className="flex items-center bg-accent/10 shadow-glow px-2 py-0.5 border border-accent/20 rounded-md"
                            style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}10` }}
                        >
                            <span
                                className="font-black text-[9px] uppercase leading-none tracking-widest"
                                style={{ color: accentColor }}
                            >
                                Beta v2
                            </span>
                        </div>
                    </div>


                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="inline-flex absolute bg-emerald-400 opacity-75 rounded-full w-full h-full animate-ping"></span>
                            <span className="inline-flex relative bg-emerald-500 rounded-full w-1.5 h-1.5"></span>
                        </span>
                        <p className="font-bold text-[9px] text-white/30 uppercase tracking-[0.3em]">
                            System Active
                        </p>
                    </div>
                </div>

                <div
                    className="group hidden md:flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-xl px-5 py-2.5 border border-white/5 rounded-2xl transition-all"
                    style={{ boxShadow: `0 0 20px ${accentColor}10` }}
                >
                    <Clock
                        size={14}
                        style={{ color: accentColor }}
                        className="group-hover:scale-110 transition-transform animate-pulse"
                        strokeWidth={2.5}
                    />
                    <span className="font-black tabular-nums text-white/60 text-xs tracking-[0.2em]">
                        {formatTime(currentTime)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {(isInstallable || true) && (
                    <button
                        onClick={handleInstallClick}
                        className="group slide-in-from-right-4 flex items-center gap-2 bg-accent/10 hover:bg-accent/20 shadow-glow px-4 border border-accent/30 rounded-2xl h-12 text-accent transition-all animate-in fade-in"
                        style={{
                            color: accentColor,
                            borderColor: `${accentColor}40`,
                            boxShadow: `0 0 20px ${accentColor}20`
                        }}
                    >
                        <Download size={18} className="animate-bounce" strokeWidth={2.5} />
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-black text-[10px] uppercase tracking-tighter">Install</span>
                            <span className="opacity-50 font-bold text-[8px] uppercase tracking-widest">Ataraxia</span>
                        </div>
                    </button>
                )}

                <button
                    onClick={requestPermission}
                    className={`relative flex justify-center items-center border rounded-2xl w-12 h-12 transition-all ${isGranted
                        ? 'bg-accent/10 border-accent/30 text-accent shadow-glow'
                        : 'bg-white/5 border-white/10 text-white/20 hover:text-white'
                        }`}
                    style={isGranted ? { color: accentColor, borderColor: `${accentColor}40` } : {}}
                >
                    {isGranted ? <Bell size={20} /> : <BellOff size={20} />}
                    {isGranted && (
                        <span className="top-3 right-3 absolute rounded-full w-2 h-2 animate-pulse" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
                    )}
                </button>

                {isRealUser ? (
                    <div className="flex items-center gap-3 bg-white/5 py-1.5 pr-2 pl-5 border border-white/10 rounded-2xl">
                        <span className="font-bold text-white/80 text-xs uppercase tracking-wider">
                            {validUsername}
                        </span>
                        <button
                            onClick={logout}
                            className="group flex justify-center items-center bg-black/40 hover:bg-red-500/20 border border-white/5 rounded-xl w-9 h-9 text-white/40 hover:text-red-500 transition-all"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className="group flex justify-center items-center bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-2xl w-12 h-12 text-white/40 hover:text-accent transition-all"
                    >
                        <User size={20} />
                    </button>
                )}
            </div>

            <Suspense fallback={null}>
                {isAuthOpen && (
                    <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
                )}
            </Suspense>
        </header>
    );
};

export default Header;