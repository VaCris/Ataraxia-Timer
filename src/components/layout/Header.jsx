import React from 'react';
import { usePomodoro } from '../../context/PomodoroContext';
import { User } from 'lucide-react';

const Header = () => {
    const { state } = usePomodoro();
    // const xpInCurrentLevel = state.stats.xp % 100;

    return (
        <header className="flex justify-between items-center px-8 py-6 w-full">
            <div>
                <h1 className="font-bold text-xl tracking-tight">ATARAXIA <span className="text-accent text-xs align-top">V2</span></h1>
                <p className="font-medium text-white/40 text-xs uppercase tracking-widest">System Active</p>
            </div>

            <div className="flex items-center gap-6">
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

                <div className="flex justify-center items-center bg-surface border border-white/10 hover:border-accent/50 rounded-xl w-10 h-10 text-white/60 transition-colors cursor-pointer">
                    <User size={20} />
                </div>
            </div>
        </header>
    );
};

export default Header;