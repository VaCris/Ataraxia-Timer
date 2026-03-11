import React, { useState, useEffect, Suspense } from 'react';
import { Bell, BellOff, LogOut, Clock, Download, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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

    return (
        <header className="z-50 flex justify-between items-center px-6 sm:px-12 2xl:px-20 py-6 sm:py-10 w-full">
            <div className="flex items-center gap-6 sm:gap-12">
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-2 sm:gap-4">
                        <h1 className="font-black text-white text-xl sm:text-3xl 2xl:text-5xl italic leading-none tracking-tighter">ATARAXIA</h1>
                        <div className="hidden xs:block bg-accent/10 px-2 py-1 border border-accent/20 rounded-lg">
                            <span className="font-black text-[9px] sm:text-xs 2xl:text-lg uppercase leading-none tracking-widest" style={{ color: accentColor }}>BETA V2</span>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2 mt-2">
                        <span className="relative flex w-1.5 sm:w-2 h-1.5 sm:h-2">
                            <span className="absolute bg-emerald-400 opacity-75 rounded-full w-full h-full animate-ping"></span>
                            <span className="relative bg-emerald-500 rounded-full w-full h-full"></span>
                        </span>
                        <p className="font-bold text-[8px] text-white/30 sm:text-[10px] 2xl:text-lg uppercase tracking-[0.3em]">System Active</p>
                    </div> */}
                </div>
                <div className="hidden xl:flex items-center gap-4 bg-white/5 shadow-xl backdrop-blur-2xl px-6 py-3 border border-white/5 rounded-2xl">
                    <Clock size={16} style={{ color: accentColor }} className="animate-pulse" strokeWidth={3} />
                    <span className="font-black tabular-nums text-white/60 text-sm 2xl:text-2xl tracking-widest">{formatTime(currentTime)}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {isInstallable && (
                    <button onClick={handleInstallClick} className="flex justify-center items-center bg-accent/10 hover:bg-accent/20 shadow-glow px-0 sm:px-6 border border-accent/30 rounded-xl sm:rounded-2xl w-11 sm:w-auto h-11 sm:h-14 text-accent active:scale-95 transition-all">
                        <Download size={20} className="animate-bounce" />
                        <span className="hidden sm:block ml-3 font-black text-xs 2xl:text-xl uppercase">Install</span>
                    </button>
                )}
                <button onClick={requestPermission} className={`flex justify-center items-center border rounded-xl sm:rounded-2xl w-11 sm:w-14 h-11 sm:h-14 transition-all active:scale-95 ${isGranted ? 'bg-accent/10 border-accent/30 text-accent shadow-glow' : 'bg-white/5 border-white/10 text-white/20'}`}>
                    {isGranted ? <Bell size={22} /> : <BellOff size={22} />}
                </button>
                {isRealUser ? (
                    <div className="flex items-center gap-3 bg-white/5 shadow-lg py-2 pr-2 pl-4 sm:pl-8 border border-white/10 rounded-xl sm:rounded-2xl">
                        <div className="hidden flex md:flex flex-col items-end">
                            <span className="font-black text-[10px] text-white sm:text-xs 2xl:text-xl uppercase leading-none tracking-widest">{user.username || user.name}</span>
                            <span className="flex items-center gap-1 mt-1 text-[8px] text-accent uppercase tracking-tighter"><ShieldCheck size={10} /> Verified User</span>
                        </div>
                        <button onClick={logout} className="flex justify-center items-center bg-black/40 hover:bg-red-500/10 border border-white/5 rounded-lg sm:rounded-xl w-8 sm:w-11 h-8 sm:h-11 text-white/20 hover:text-red-500 transition-all"><LogOut size={16} /></button>
                    </div>
                ) : (
                    <button onClick={() => setIsAuthOpen(true)} className="flex justify-center items-center bg-white/5 hover:bg-accent/10 shadow-xl border border-white/10 rounded-xl sm:rounded-2xl w-11 sm:w-14 h-11 sm:h-14 text-white/20 hover:text-accent transition-all"><User size={22} /></button>
                )}
            </div>
            <Suspense fallback={null}>{isAuthOpen && <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />}</Suspense>
        </header>
    );
};

export default Header;