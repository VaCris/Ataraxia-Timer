import React from 'react';
import { Layout, Settings, Coffee, Heart, Music } from 'lucide-react';
import Tooltip from './Tooltip';
import { useMusic } from '@context/MusicContext';

const Sidebar = ({ onOpenSettings, onOpenSupport }) => {
    const { openModal, isModalOpen } = useMusic();

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

                <Tooltip text="Player">
                    <button
                        onClick={openModal}
                        className={`p-3 transition-all rounded-xl ${isModalOpen ? 'text-accent bg-accent/10 shadow-glow' : 'text-white/30 hover:text-white'}`}
                    >
                        <Music size={24} />
                    </button>
                </Tooltip>
            </nav>

            <div className="flex flex-col gap-4">
                <Tooltip text="Support">
                    <button onClick={onOpenSupport} className="p-3 text-white/30 hover:text-accent transition-colors">
                        <Heart size={24} />
                    </button>
                </Tooltip>

                <Tooltip text="Settings">
                    <button onClick={onOpenSettings} className="p-3 text-white/30 hover:text-white hover:rotate-45 transition-all">
                        <Settings size={24} />
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
};

export default Sidebar;