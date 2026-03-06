import React, { useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { useStats } from '@hooks/useStats';
import { useSettings as useApiSettings } from '@hooks/useSettings';
import { useTimer } from '@hooks/useTimer';
import Sidebar from '@components/layout/Sidebar';
import Header from '@components/layout/Header';
import TimerDial from '@components/timer/TimerDial';
import TaskManager from '@components/tasks/TaskManager';
import SettingsModal from '@components/layout/SettingsModal';
import SupportModal from '@components/layout/SupportModal';
import MusicWidget from '@components/layout/MusicWidget';
import Toast from '@components/layout/Toast';
import PipPortal from '@components/timer/PipPortal';

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#e11d48');
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '225 29 72';
};

const Dashboard = ({ onOpenGames, onOpenStats, onOpenAchievements }) => {
    const { progress, refresh: refreshStats } = useStats();
    const { settings: apiSettings } = useApiSettings();
    const { state, dispatch } = useTimer(refreshStats);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [pipWindow, setPipWindow] = useState(null);
    const pipRef = useRef(null);
    const { bgImage, blurIntensity, accentColor } = useSelector(state => state.settings);
    const accentRgb = useMemo(() => hexToRgb(accentColor), [accentColor]);

    const handleTogglePip = async () => {
        if (pipRef.current) { pipRef.current.close(); return; }
        try {
            const pip = await window.documentPictureInPicture.requestWindow({ width: 400, height: 350 });
            const style = pip.document.createElement('style');
            style.textContent = `body { margin: 0; padding: 0; background: #050505; overflow: hidden; }`;
            pip.document.head.appendChild(style);
            pip.addEventListener("pagehide", () => { pipRef.current = null; setPipWindow(null); });
            pipRef.current = pip;
            setPipWindow(pip);
        } catch (error) { console.error("PiP failed:", error); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex w-screen h-screen overflow-hidden text-cream" style={{ '--color-accent': accentColor || '#e11d48', '--color-accent-rgb': accentRgb }}>
            <div className="fixed inset-0 transition-all duration-1000 ease-in-out pointer-events-none" style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)', backgroundSize: 'cover', backgroundPosition: 'center', filter: `blur(${blurIntensity || 0}px) brightness(0.45)`, transform: 'scale(1.1)', zIndex: -1 }} />
            <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} onOpenSupport={() => setIsSupportOpen(true)} onOpenGames={onOpenGames} onOpenStats={onOpenStats} onOpenAchievements={onOpenAchievements} />
            <main className="z-10 relative flex flex-col flex-1 h-full overflow-hidden">
                <Header userStats={progress} />
                <div className="flex flex-col flex-1 px-4 md:px-8 pb-4 md:pb-6 min-h-0">
                    <div className="flex-1 gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-0">
                        <section className="relative flex flex-col justify-center items-center lg:col-span-7 shadow-2xl p-8 rounded-[3rem] min-h-0 overflow-hidden glass">
                            <button onClick={handleTogglePip} className={`absolute top-8 right-8 p-3 rounded-2xl transition-all z-10 ${pipWindow ? 'bg-accent text-white shadow-glow' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                                <ExternalLink size={20} />
                            </button>
                            <div className="flex gap-2 bg-black/40 mb-12 p-1.5 border border-white/10 rounded-[2rem]">
                                {['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'].map((m) => (
                                    <button key={m} onClick={() => dispatch({ type: 'SET_MODE', payload: m })} className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.4rem] transition-all ${state.mode === m ? 'bg-surface text-accent shadow-glow border border-white/10 scale-105' : 'text-white/20 hover:text-white/40'}`}>
                                        {m.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            <div className="my-8 scale-110 xl:scale-125 transition-transform">
                                <TimerDial isPipMode={false} />
                            </div>
                            <div className="flex items-center gap-6 mt-12">
                                <button onClick={() => dispatch({ type: 'TOGGLE_TIMER' })} className={`px-14 py-5 rounded-[2rem] font-black text-sm tracking-[0.3em] transition-all hover:scale-105 active:scale-95 ${state.isActive ? 'bg-transparent border-2 border-accent text-accent' : 'bg-accent text-white shadow-glow'}`}>
                                    {state.isActive ? 'PAUSE SYSTEM' : 'START SESSION'}
                                </button>
                                <button onClick={() => dispatch({ type: 'RESET_TIMER' })} className="bg-white/5 hover:bg-white/10 p-5 border border-white/10 rounded-[1.8rem] text-white/40 hover:text-white transition-colors">
                                    <motion.div whileTap={{ rotate: -180 }}><RotateCcw size={24} /></motion.div>
                                </button>
                            </div>
                        </section>
                        <section className="flex flex-col lg:col-span-5 h-full min-h-0"><TaskManager /></section>
                    </div>
                </div>
                <div className="bottom-6 left-6 z-50 absolute"><MusicWidget /></div>
            </main>
            {pipWindow && <PipPortal pipWindow={pipWindow} />}
            <Toast isOpen={state.toast.isOpen} message={state.toast.message} onClose={() => dispatch({ type: 'HIDE_TOAST' })} />
            <AnimatePresence>
                {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                {isSupportOpen && <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default Dashboard;