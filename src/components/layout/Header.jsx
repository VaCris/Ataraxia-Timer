import React, { useState, Suspense } from 'react';
import { usePomodoro } from '@context/PomodoroContext';
import { User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
const AuthModal = React.lazy(() => import('@components/modals/AuthModal'));


const Header = () => {
    const { state } = usePomodoro();
    const { user, logout } = useAuth();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const isRealUser = user && !user.isGuest;

    const validUsername = (() => {
        const name = user?.username || user?.name;
        if (!name || name.includes('@')) return null;
        return name;
    })();

    return (
        <header className="flex justify-between items-center px-8 py-6 w-full">
            <div>
                <h1 className="font-bold text-xl tracking-tight">ATARAXIA <span className="text-accent text-xs align-top">V2</span></h1>
                <p className="font-medium text-white/40 text-xs uppercase tracking-widest">System Active</p>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative flex justify-center items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl w-12 h-12 text-white/20 hover:text-white transition-all">
                    <Bell size={20} />
                    <span className="top-3 right-3 absolute bg-accent shadow-glow rounded-full w-2 h-2" />
                </button>

                {isRealUser ? (
                    <div className="flex items-center gap-3 bg-white/5 py-1.5 pr-2 pl-5 border border-white/10 rounded-2xl">
                        <div className="flex justify-center items-center min-w-[24px]">
                            {validUsername ? (
                                <span className="pr-2 font-bold text-white/80 text-xs uppercase tracking-wider">
                                    {validUsername}
                                </span>
                            ) : (
                                <User size={20} className="mr-2 text-white/40" />
                            )}
                        </div>
                        <button
                            onClick={logout}
                            title="Cerrar sesión"
                            className="group flex justify-center items-center bg-black/40 hover:bg-red-500/20 border border-white/5 hover:border-red-500/50 rounded-xl w-9 h-9 text-white/40 hover:text-red-500 transition-all"
                        >
                            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAuthOpen(true)}
                        className="group flex justify-center items-center bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-2xl w-12 h-12 text-white/40 hover:text-accent transition-all"
                    >
                        <User size={20} className="group-hover:scale-110 transition-transform" />
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