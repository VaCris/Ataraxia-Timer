import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

import { useMusic } from '@context/MusicContext'
import { usePomodoroController } from '@/features/pomodoro/hooks/usePomodoroController'
import { usePipController } from '@/features/pomodoro/hooks/usePipController'
import { useUISettings } from '@/features/settings/hooks/useUISettings'
import { useThemeEffect } from '@/app/providers/theme/useThemeEffect'

import Sidebar from '@/app/layout/Sidebar'
import Header from '@/app/layout/Header'
import TimerDial from '@/features/pomodoro/components/TimerDial'
import TaskManager from '@components/tasks/TaskManager'
import SettingsModal from '@components/layout/SettingsModal'
import SupportModal from '@/shared/ui/modals/SupportModal'
import MusicWidget from '@/features/pomodoro/components/MusicWidget'
import PipPortal from '@/features/pomodoro/components/PipPortal'

const Dashboard = ({ onOpenGames, onOpenStats, onOpenAchievements }) => {
    const { isModalOpen, toggleMusic } = useMusic()

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isSupportOpen, setIsSupportOpen] = useState(false)
    const [currentRound, setCurrentRound] = useState(1)

    const uiSettings = useUISettings()
    const pomodoro = usePomodoroController(currentRound, setCurrentRound)
    const pip = usePipController()

    useThemeEffect(
        uiSettings.accentColor,
        uiSettings.bgImage,
        uiSettings.blurIntensity
    )

    return (
        <motion.div
            className="relative flex w-screen h-screen overflow-hidden text-cream"
            style={{
                '--color-accent': uiSettings.accentColor
            }}
        >
            <div
                className="fixed inset-0 transition-opacity duration-500 pointer-events-none"
                style={{
                    backgroundImage: 'var(--bg-image)',
                    opacity: uiSettings.bgImage ? 1 : 0
                }}
            />

            <Sidebar
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSupport={() => setIsSupportOpen(true)}
                onOpenGames={onOpenGames}
                onOpenStats={onOpenStats}
                onOpenAchievements={onOpenAchievements}
                onOpenMusic={toggleMusic}
                isMusicOpen={isModalOpen}
                customShortcuts={uiSettings.customShortcuts}
            />

            <main className="flex flex-col flex-1">
                <Header is24Hour={uiSettings.is24Hour} />

                <div className="flex flex-col flex-1 justify-center items-center gap-6">

                    <TimerDial currentRound={currentRound} />

                    <button onClick={pip.togglePip}>
                        <ExternalLink size={20} />
                    </button>

                    <button onClick={pomodoro.toggle}>
                        {pomodoro.isActive ? 'PAUSE' : 'START'}
                    </button>

                    <button onClick={pomodoro.reset}>
                        RESET
                    </button>

                    <TaskManager />
                </div>
            </main>

            {pip.pipWindow && (
                <PipPortal
                    pipWindow={pip.pipWindow}
                    currentRound={currentRound}
                />
            )}

            <AnimatePresence>
                {isSettingsOpen && (
                    <SettingsModal onClose={() => setIsSettingsOpen(false)} />
                )}
                {isSupportOpen && (
                    <SupportModal onClose={() => setIsSupportOpen(false)} />
                )}
            </AnimatePresence>

            <MusicWidget />
        </motion.div>
    )
}

export default Dashboard