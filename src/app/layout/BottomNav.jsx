import React from 'react'
import { Layout, Music, Gamepad2, BarChart2, Trophy, Settings } from 'lucide-react'
import { useMusic } from '@context/MusicContext'

const NavButton = ({ icon, onClick, active = false }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center flex-1 py-3 transition-all ${active ? 'text-accent' : 'text-white/30 hover:text-white/60'
            }`}
    >
        {React.createElement(icon, {
            size: 24,
            className: active ? 'shadow-glow' : '',
        })}
    </button>
)

const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const BottomNav = ({ onOpenSettings, onOpenGames, onOpenStats, onOpenAchievements }) => {
    const { openModal, isModalOpen } = useMusic()

    const navItems = [
        { id: 'home', icon: Layout, onClick: handleScrollToTop, active: true },
        { id: 'music', icon: Music, onClick: openModal, active: isModalOpen },
        { id: 'games', icon: Gamepad2, onClick: onOpenGames },
        { id: 'stats', icon: BarChart2, onClick: onOpenStats },
        { id: 'achievements', icon: Trophy, onClick: onOpenAchievements },
        { id: 'settings', icon: Settings, onClick: onOpenSettings },
    ]

    return (
        <nav className="lg:hidden right-0 bottom-0 left-0 z-[60] fixed flex justify-around items-center bg-surface/80 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl px-4 border-white/5 border-t h-20">
            {navItems.map((item) => (
                <NavButton
                    key={item.id}
                    icon={item.icon}
                    onClick={item.onClick}
                    active={item.active}
                />
            ))}
        </nav>
    )
}

export default BottomNav