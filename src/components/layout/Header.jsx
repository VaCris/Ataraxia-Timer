import React, { useState, Suspense } from 'react';
import { usePomodoro } from '@context/PomodoroContext';
import { User, Bell } from 'lucide-react';
const AuthModal = React.lazy(() => import('@components/modals/AuthModal'));
const Header = () => {
    const { state } = usePomodoro();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    // const xpInCurrentLevel = state.stats.xp % 100;

    return (
        <header className="flex justify-between items-center px-8 py-6 w-full">
            <div>
                <h1 className="font-bold text-xl tracking-tight">ATARAXIA <span className="text-accent text-xs align-top">V2</span></h1>
                <p className="font-medium text-white/40 text-xs uppercase tracking-widest">System Active</p>
            </div>

            <div className="flex items-center gap-4">
                {/* <div className="hidden sm:block text-right">
                    <div className="flex justify-end items-center gap-2 mb-1">
                        <span className="font-bold text-[10px] text-white/40 uppercase tracking-tighter">Level</span>
                        <span className="font-bold text-accent text-sm">{state.stats.level}</span>
                    </div>
                    <div className="bg-white/5 rounded-full w-32 h-1 overflow-hidden">
                        <div
                            className="bg-accent shadow-glow h-full transition-all duration-1000 ease-out"
                            style={{ width: `${xpInCurrentLevel}%` }}
                        />
                    </div>
                </div> */}

                <button className="relative flex justify-center items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl w-12 h-12 text-white/20 hover:text-white transition-all">
                    <Bell size={20} />
                    <span className="top-3 right-3 absolute bg-accent shadow-glow rounded-full w-2 h-2" />
                </button>

                <button
                    onClick={() => setIsAuthOpen(true)}
                    className="group flex justify-center items-center bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-2xl w-12 h-12 text-white/40 hover:text-accent transition-all"
                >
                    <User size={20} className="group-hover:scale-110 transition-transform" />
                </button>
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