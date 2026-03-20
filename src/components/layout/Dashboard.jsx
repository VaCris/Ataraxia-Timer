import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, RotateCcw } from 'lucide-react'
import { useStats } from '@hooks/useStats'
import { useTimer } from '@hooks/useTimer'
import Sidebar from '@components/layout/Sidebar'
import Header from '@components/layout/Header'
import TimerDial from '@components/timer/TimerDial'
import TaskManager from '@components/tasks/TaskManager'
import SettingsModal from '@components/layout/SettingsModal'
import SupportModal from '@components/layout/SupportModal'
import MusicWidget from '@components/layout/MusicWidget'
import Toast from '@components/layout/Toast'
import PipPortal from '@components/timer/PipPortal'
import { resetTimer, setMode, toggleTimer, updateDurations } from '@/store/slices/timerSlice'
import { setInitialTime } from '@/store/slices/pomodoroSlice'
import { fetchSettingsRequest, fetchSettingsSuccess } from '@/store/slices/settingsSlice'

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#e11d48')
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '225 29 72'
}

const Dashboard = ({ onOpenGames, onOpenStats, onOpenAchievements }) => {
    const { progress, refresh: refreshStats } = useStats()
    const reduxDispatch = useDispatch()

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isSupportOpen, setIsSupportOpen] = useState(false)
    const [pipWindow, setPipWindow] = useState(null)
    const pipRef = useRef(null)
    const [hasMergedLocal, setHasMergedLocal] = useState(false)

    const [currentRound, setCurrentRound] = useState(() => {
        const saved = localStorage.getItem('ataraxia_currentRound')
        return saved ? parseInt(saved) : 1
    })

    const settingsItem = useSelector(state => state.settings.item) || {}
    const reduxTimerState = useSelector(state => state.timer)

    const accentColor = settingsItem.accentColor || '#e11d48'
    const bgImage = settingsItem.bgImage || ''
    const blurIntensity = settingsItem.blurIntensity || 0
    const accentRgb = useMemo(() => hexToRgb(accentColor), [accentColor])

    const handleTimerComplete = useCallback(() => {
        refreshStats()

        const {
            focusDuration = 25,
            shortBreakDuration = 5,
            longBreakDuration = 15,
            autoStartBreaks = false,
            autoStartPomodoros = false,
            longBreakInterval = 4
        } = settingsItem

        let nextMode = 'FOCUS'
        let nextDuration = focusDuration
        let shouldAutoStart = false

        if (reduxTimerState.mode === 'FOCUS') {
            if (currentRound >= longBreakInterval) {
                nextMode = 'LONG_BREAK'
                nextDuration = longBreakDuration
            } else {
                nextMode = 'SHORT_BREAK'
                nextDuration = shortBreakDuration
            }
            shouldAutoStart = autoStartBreaks
        } else {
            nextMode = 'FOCUS'
            nextDuration = focusDuration
            shouldAutoStart = autoStartPomodoros

            const nextR = reduxTimerState.mode === 'LONG_BREAK' ? 1 : currentRound + 1
            setCurrentRound(nextR)
            localStorage.setItem('ataraxia_currentRound', nextR.toString())
        }

        reduxDispatch(setMode(nextMode))
        reduxDispatch(updateDurations({ mode: nextMode, duration: nextDuration }))
        reduxDispatch(setInitialTime(nextDuration * 60))

        if (shouldAutoStart) {
            setTimeout(() => {
                reduxDispatch(toggleTimer())
            }, 1200)
        }
    }, [settingsItem, reduxTimerState.mode, currentRound, reduxDispatch, refreshStats])

    const { state, dispatch: timerDispatch } = useTimer(handleTimerComplete)

    useEffect(() => {
        reduxDispatch(fetchSettingsRequest())
    }, [reduxDispatch])

    useEffect(() => {
        if (Object.keys(settingsItem).length > 0 && !hasMergedLocal) {
            const localAccent = localStorage.getItem('ataraxia_accentColor')
            const localBg = localStorage.getItem('ataraxia_bgImage')
            const localBlur = localStorage.getItem('ataraxia_blurIntensity')
            const localShortcuts = localStorage.getItem('ataraxia_customShortcuts')
            const localIs24 = localStorage.getItem('ataraxia_is24Hour')

            reduxDispatch(fetchSettingsSuccess({
                ...settingsItem,
                accentColor: localAccent || settingsItem.accentColor,
                bgImage: localBg || settingsItem.bgImage,
                blurIntensity: localBlur ? Number(localBlur) : settingsItem.blurIntensity,
                customShortcuts: localShortcuts ? JSON.parse(localShortcuts) : settingsItem.customShortcuts,
                is24Hour: localIs24 !== null ? localIs24 === 'true' : settingsItem.is24Hour
            }))

            setHasMergedLocal(true)
        }
    }, [settingsItem, hasMergedLocal])

    useEffect(() => {
        if (Object.keys(settingsItem).length > 0 && !reduxTimerState.isActive) {
            const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settingsItem

            let currentDuration = focusDuration
            if (reduxTimerState.mode === 'SHORT_BREAK') currentDuration = shortBreakDuration
            if (reduxTimerState.mode === 'LONG_BREAK') currentDuration = longBreakDuration

            const targetSeconds = currentDuration * 60

            if (reduxTimerState.initialTime !== targetSeconds) {
                reduxDispatch(updateDurations({ mode: reduxTimerState.mode, duration: currentDuration }))
                reduxDispatch(setInitialTime(targetSeconds))
            }
        }
    }, [settingsItem, reduxTimerState.mode, reduxTimerState.isActive, reduxDispatch])

    const handleModeChange = (newMode) => {
        timerDispatch(setMode(newMode))
        const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settingsItem || {}
        let newDuration = focusDuration
        if (newMode === 'SHORT_BREAK') newDuration = shortBreakDuration
        if (newMode === 'LONG_BREAK') newDuration = longBreakDuration
        reduxDispatch(updateDurations({ mode: newMode, duration: newDuration }))
        reduxDispatch(setInitialTime(newDuration * 60))
    }

    const handleTogglePip = async () => {
        if (pipRef.current) { pipRef.current.close(); return }
        try {
            const pip = await window.documentPictureInPicture.requestWindow({ width: 400, height: 350 })
            const style = pip.document.createElement('style')
            style.textContent = `body { margin: 0; padding: 0; background: #050505; overflow: hidden; }`
            pip.document.head.appendChild(style)
            pip.addEventListener("pagehide", () => { pipRef.current = null; setPipWindow(null) })
            pipRef.current = pip
            setPipWindow(pip)
        } catch (error) { console.error("PiP failed:", error) }
    }

    const bgStyle = useMemo(() => {
        if (!bgImage) {
            return {
                background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
                zIndex: -1
            }
        }

        return {
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${blurIntensity}px)`,
            transform: 'scale(1.05)',
            zIndex: -1
        }
    }, [bgImage, blurIntensity])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex w-screen h-screen overflow-hidden text-cream" style={{ '--color-accent': accentColor, '--color-accent-rgb': accentRgb }}>
            <div className="fixed inset-0" style={bgStyle} />
            <div
                className="fixed inset-0 pointer-events-none"
                style={{ background: 'rgba(0,0,0,0.55)', zIndex: -1 }}
            />
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
                                    <button key={m} onClick={() => handleModeChange(m)} className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.4rem] transition-all ${reduxTimerState.mode === m ? 'bg-surface text-accent shadow-glow border border-white/10 scale-105' : 'text-white/20 hover:text-white/40'}`}>
                                        {m.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            <div className="my-8 scale-110 xl:scale-125 transition-transform">
                                <TimerDial isPipMode={false} currentRound={currentRound} />
                            </div>
                            <div className="flex items-center gap-6 mt-12">
                                <button onClick={() => timerDispatch(toggleTimer())} className={`px-14 py-5 rounded-[2rem] font-black text-sm tracking-[0.3em] transition-all hover:scale-105 active:scale-95 ${reduxTimerState.isActive ? 'bg-transparent border-2 border-accent text-accent' : 'bg-accent text-white shadow-glow'}`}>
                                    {reduxTimerState.isActive ? 'PAUSE SYSTEM' : 'START SESSION'}
                                </button>
                                <button onClick={() => {
                                    const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settingsItem
                                    let d = reduxTimerState.mode === 'SHORT_BREAK' ? shortBreakDuration : reduxTimerState.mode === 'LONG_BREAK' ? longBreakDuration : focusDuration
                                    timerDispatch(resetTimer(d * 60))
                                    reduxDispatch(setInitialTime(d * 60))
                                }} className="bg-white/5 hover:bg-white/10 p-5 border border-white/10 rounded-[1.8rem] text-white/40 hover:text-white transition-colors">
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
            <Toast isOpen={state.toast?.isOpen} message={state.toast?.message} onClose={() => timerDispatch({ type: 'HIDE_TOAST' })} />
            <AnimatePresence>
                {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                {isSupportOpen && <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />}
            </AnimatePresence>
        </motion.div>
    )
}

export default Dashboard