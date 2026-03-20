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
import { applyAccentColor, applyBgImage } from '@/utils/theme'

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

    const accentColor = useMemo(() => localStorage.getItem('ataraxia_accentColor') || settingsItem.accentColor || '#e11d48', [settingsItem.accentColor])
    const bgImage = useMemo(() => localStorage.getItem('ataraxia_bgImage') || settingsItem.bgImage || '', [settingsItem.bgImage])
    const blurIntensity = useMemo(() => Number(localStorage.getItem('ataraxia_blurIntensity')) || settingsItem.blurIntensity || 0, [settingsItem.blurIntensity])
    const accentRgb = useMemo(() => hexToRgb(accentColor), [accentColor])

    useEffect(() => {
        applyAccentColor(accentColor)
        applyBgImage(bgImage)
    }, [accentColor, bgImage])

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
            const newRound = reduxTimerState.mode === 'LONG_BREAK' ? 1 : currentRound + 1
            setCurrentRound(newRound)
            localStorage.setItem('ataraxia_currentRound', newRound.toString())
        }

        reduxDispatch(setMode(nextMode))
        reduxDispatch(updateDurations({ mode: nextMode, duration: nextDuration }))
        reduxDispatch(setInitialTime(nextDuration * 60))

        if (shouldAutoStart) {
            setTimeout(() => reduxDispatch(toggleTimer()), 1000)
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

            if (localAccent || localBg || localBlur || localShortcuts) {
                reduxDispatch(fetchSettingsSuccess({
                    ...settingsItem,
                    accentColor: localAccent || settingsItem.accentColor,
                    bgImage: localBg || settingsItem.bgImage,
                    blurIntensity: localBlur ? Number(localBlur) : settingsItem.blurIntensity,
                    customShortcuts: localShortcuts ? JSON.parse(localShortcuts) : settingsItem.customShortcuts
                }))
            }
            setHasMergedLocal(true)
        }
    }, [settingsItem, hasMergedLocal, reduxDispatch])

    useEffect(() => {
        if (Object.keys(settingsItem).length > 0 && !reduxTimerState.isActive) {
            const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settingsItem
            let d = reduxTimerState.mode === 'SHORT_BREAK' ? shortBreakDuration : reduxTimerState.mode === 'LONG_BREAK' ? longBreakDuration : focusDuration
            if (reduxTimerState.initialTime !== d * 60) {
                reduxDispatch(updateDurations({ mode: reduxTimerState.mode, duration: d }))
                reduxDispatch(setInitialTime(d * 60))
            }
        }
    }, [settingsItem, reduxTimerState.mode, reduxTimerState.isActive, reduxDispatch])

    const handleModeChange = (m) => {
        timerDispatch(setMode(m))
        const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settingsItem
        let d = m === 'SHORT_BREAK' ? shortBreakDuration : m === 'LONG_BREAK' ? longBreakDuration : focusDuration
        reduxDispatch(updateDurations({ mode: m, duration: d }))
        reduxDispatch(setInitialTime(d * 60))
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
        } catch (e) { console.error(e) }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex w-screen h-screen overflow-hidden text-cream" style={{ '--color-accent': accentColor, '--color-accent-rgb': accentRgb }}>
            <div className="fixed inset-0 transition-all duration-1000 ease-in-out pointer-events-none" style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', filter: `blur(${blurIntensity}px) brightness(0.45)`, transform: 'scale(1.1)', zIndex: -1, backgroundColor: bgImage ? 'transparent' : '#050505' }} />
            <div
                className="fixed inset-0 transition-all duration-1000 ease-in-out pointer-events-none"
                style={{
                    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: `blur(${blurIntensity}px) brightness(0.45)`,
                    transform: 'scale(1.1)',
                    zIndex: -1,
                    backgroundColor: bgImage ? 'transparent' : '#050505'
                }}
            />
            <div className="z-0 fixed inset-0 bg-black/10 pointer-events-none" />
            <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} onOpenSupport={() => setIsSupportOpen(true)} onOpenGames={onOpenGames} onOpenStats={onOpenStats} onOpenAchievements={onOpenAchievements} />
            <main className="z-10 relative flex flex-col flex-1 h-full overflow-hidden">
                <Header userStats={progress} />
                <div className="flex flex-col flex-1 px-4 md:px-8 pb-4 md:pb-6 min-h-0">
                    <div className="flex-1 gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-0">
                        <section className="relative flex flex-col justify-center items-center lg:col-span-7 shadow-2xl p-8 rounded-[3rem] min-h-0 overflow-hidden glass">
                            <button onClick={handleTogglePip} className={`absolute top-8 right-8 p-3 rounded-2xl transition-all z-10 ${pipWindow ? 'bg-accent text-white shadow-glow' : 'bg-white/5 text-white/20 hover:text-white'}`}><ExternalLink size={20} /></button>
                            <div className="flex gap-2 bg-black/40 mb-12 p-1.5 border border-white/10 rounded-[2rem]">
                                {['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'].map((m) => (
                                    <button key={m} onClick={() => handleModeChange(m)} className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.4rem] transition-all ${reduxTimerState.mode === m ? 'bg-surface text-accent shadow-glow border border-white/10 scale-105' : 'text-white/20 hover:text-white/40'}`}>{m.replace('_', ' ')}</button>
                                ))}
                            </div>
                            <div className="my-8 scale-110 xl:scale-125 transition-transform">
                                <TimerDial isPipMode={false} currentRound={currentRound} />
                            </div>
                            <div className="flex items-center gap-6 mt-12">
                                <button onClick={() => timerDispatch(toggleTimer())} className={`px-14 py-5 rounded-[2rem] font-black text-sm tracking-[0.3em] transition-all hover:scale-105 active:scale-95 ${reduxTimerState.isActive ? 'bg-transparent border-2' : 'text-white shadow-glow'}`} style={reduxTimerState.isActive ? { borderColor: accentColor, color: accentColor } : { backgroundColor: accentColor }}>{reduxTimerState.isActive ? 'PAUSE SYSTEM' : 'START SESSION'}</button>
                                <button onClick={() => {
                                    const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15 } = settingsItem
                                    let d = reduxTimerState.mode === 'SHORT_BREAK' ? shortBreakDuration : reduxTimerState.mode === 'LONG_BREAK' ? longBreakDuration : focusDuration
                                    timerDispatch(resetTimer(d * 60))
                                    reduxDispatch(setInitialTime(d * 60))
                                }} className="bg-white/5 hover:bg-white/10 p-5 border border-white/10 rounded-[1.8rem] text-white/40 hover:text-white transition-colors"><RotateCcw size={24} /></button>
                            </div>
                        </section>
                        <section className="flex flex-col lg:col-span-5 h-full min-h-0"><TaskManager /></section>
                    </div>
                </div>
            </main>
            {pipWindow && <PipPortal pipWindow={pipWindow} />}
            <AnimatePresence>
                {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                {isSupportOpen && <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />}
            </AnimatePresence>
        </motion.div>

    )
}

export default Dashboard