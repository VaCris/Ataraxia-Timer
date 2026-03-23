import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, RotateCcw } from 'lucide-react'
//import { useStats } from '@hooks/useStats'
import { useTimer } from '@hooks/useTimer'
import { useMusic } from '@context/MusicContext'
import Sidebar from '@components/layout/Sidebar'
import Header from '@components/layout/Header'
import TimerDial from '@components/timer/TimerDial'
import TaskManager from '@components/tasks/TaskManager'
import SettingsModal from '@components/layout/SettingsModal'
import SupportModal from '@components/layout/SupportModal'
import MusicWidget from '@components/layout/MusicWidget'
import Toast from '@components/layout/Toast'
import PipPortal from '@components/timer/PipPortal'
import { resetTimer, setMode, toggleTimer, updateDurations } from '@store/slices/timerSlice'
import { setInitialTime } from '@store/slices/pomodoroSlice'
import { fetchSettingsRequest, fetchSettingsSuccess } from '@store/slices/settingsSlice'
import { applyAccentColor, applyBgImage, applyBlur } from '@utils/theme'

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#e11d48')
    return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '225 29 72'
}

const Dashboard = ({ onOpenGames, onOpenStats, onOpenAchievements }) => {
    //const { progress, refresh: refreshStats } = useStats()
    const { isModalOpen, toggleMusic } = useMusic()
    const reduxDispatch = useDispatch()

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isSupportOpen, setIsSupportOpen] = useState(false)
    const [pipWindow, setPipWindow] = useState(null)
    const pipRef = useRef(null)
    const [hasMergedLocal, setHasMergedLocal] = useState(false)

    const [currentRound, setCurrentRound] = useState(() => Number(localStorage.getItem('ataraxia_currentRound')) || 1)

    const settingsItem = useSelector(state => state.settings.item) || {}
    const reduxTimerState = useSelector(state => state.timer)

    const accentColor = settingsItem.accentColor || localStorage.getItem('ataraxia_accentColor') || '#e11d48'
    const bgImage = settingsItem.bgImage || localStorage.getItem('ataraxia_bgImage') || ''
    const blurIntensity = settingsItem.blurIntensity || Number(localStorage.getItem('ataraxia_blurIntensity')) || 0
    const accentRgb = useMemo(() => hexToRgb(accentColor), [accentColor])

    useEffect(() => {
        applyAccentColor(accentColor)
        applyBgImage(bgImage)
        applyBlur(blurIntensity)
    }, [accentColor, bgImage, blurIntensity])

    const handleTimerComplete = useCallback(() => {
        //refreshStats()
        const { focusDuration = 25, shortBreakDuration = 5, longBreakDuration = 15, autoStartBreaks = false, autoStartPomodoros = false, longBreakInterval = 4 } = settingsItem

        let nextMode = 'FOCUS', nextDuration = focusDuration, shouldAutoStart = false

        if (reduxTimerState.mode === 'FOCUS') {
            if (currentRound >= longBreakInterval) {
                nextMode = 'LONG_BREAK'; nextDuration = longBreakDuration
            } else {
                nextMode = 'SHORT_BREAK'; nextDuration = shortBreakDuration
            }
            shouldAutoStart = autoStartBreaks
        } else {
            const isFromLongBreak = reduxTimerState.mode === 'LONG_BREAK'
            const nextR = isFromLongBreak ? 1 : currentRound + 1
            setCurrentRound(nextR)
            localStorage.setItem('ataraxia_currentRound', nextR.toString())
            nextMode = 'FOCUS'; nextDuration = focusDuration; shouldAutoStart = autoStartPomodoros
        }

        reduxDispatch(setMode(nextMode))
        reduxDispatch(updateDurations({ mode: nextMode, duration: nextDuration }))
        reduxDispatch(setInitialTime(nextDuration * 60))
        if (shouldAutoStart) setTimeout(() => reduxDispatch(toggleTimer()), 1200)
    }, [settingsItem, reduxTimerState.mode, currentRound, reduxDispatch])

    const { state, dispatch: timerDispatch } = useTimer(handleTimerComplete)

    useEffect(() => { reduxDispatch(fetchSettingsRequest()) }, [reduxDispatch])

    useEffect(() => {
        if (Object.keys(settingsItem).length > 0 && !hasMergedLocal) {
            const localS = {
                accentColor: localStorage.getItem('ataraxia_accentColor'),
                bgImage: localStorage.getItem('ataraxia_bgImage'),
                blurIntensity: localStorage.getItem('ataraxia_blurIntensity'),
                is24Hour: localStorage.getItem('ataraxia_is24Hour'),
                customShortcuts: localStorage.getItem('ataraxia_customShortcuts')
            }
            if (localS.accentColor || localS.bgImage) {
                reduxDispatch(fetchSettingsSuccess({
                    ...settingsItem,
                    accentColor: localS.accentColor || settingsItem.accentColor,
                    bgImage: localS.bgImage || settingsItem.bgImage,
                    blurIntensity: localS.blurIntensity ? Number(localS.blurIntensity) : settingsItem.blurIntensity,
                    is24Hour: localS.is24Hour !== null ? localS.is24Hour === 'true' : settingsItem.is24Hour,
                    customShortcuts: localS.customShortcuts ? JSON.parse(localS.customShortcuts) : settingsItem.customShortcuts
                }))
            }
            setHasMergedLocal(true)
        }
    }, [settingsItem, hasMergedLocal, reduxDispatch])

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
            <div
                className="-z-0 fixed inset-0 transition-opacity duration-700 pointer-events-none"
                style={{
                    backgroundImage: 'var(--bg-image)',
                    filter: 'blur(var(--bg-blur, 0px)) brightness(0.45)',
                    transform: 'scale(1.1)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: bgImage ? 1 : 0
                }}
            />
            {!bgImage && (
                <div className="-z-20 fixed inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a]" />
            )}
            <Sidebar
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenSupport={() => setIsSupportOpen(true)}
                onOpenGames={onOpenGames}
                onOpenStats={onOpenStats}
                onOpenAchievements={onOpenAchievements}
                onOpenMusic={toggleMusic}
                isMusicOpen={isModalOpen}
                customShortcuts={settingsItem.customShortcuts}
            />

            <main className="z-10 relative flex flex-col flex-1 h-full overflow-hidden">
                <Header is24Hour={settingsItem.is24Hour} />
                <div className="flex flex-col flex-1 px-4 md:px-8 pb-4 md:pb-6 min-h-0">
                    <div className="flex-1 gap-6 grid grid-cols-1 lg:grid-cols-12 min-h-0">
                        <section className="relative flex flex-col justify-center items-center lg:col-span-7 shadow-2xl p-8 rounded-[3rem] min-h-0 overflow-hidden glass">
                            <button onClick={handleTogglePip} className="top-8 right-8 z-10 absolute bg-white/5 p-3 rounded-2xl text-white/20 hover:text-white transition-all"><ExternalLink size={20} /></button>
                            <div className="flex gap-2 bg-black/40 mb-12 p-1.5 border border-white/10 rounded-[2rem]">
                                {['FOCUS', 'SHORT_BREAK', 'LONG_BREAK'].map((m) => (
                                    <button key={m} onClick={() => {
                                        timerDispatch(setMode(m))
                                        const d = m === 'SHORT_BREAK' ? settingsItem.shortBreakDuration : m === 'LONG_BREAK' ? settingsItem.longBreakDuration : settingsItem.focusDuration
                                        reduxDispatch(updateDurations({ mode: m, duration: d })); reduxDispatch(setInitialTime(d * 60))
                                    }} className={`px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-[1.4rem] transition-all ${reduxTimerState.mode === m ? 'bg-surface text-accent shadow-glow border border-white/10 scale-105' : 'text-white/20 hover:text-white/40'}`}>
                                        {m.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                            <div className="my-8 scale-110 xl:scale-125 transition-transform">
                                <TimerDial currentRound={currentRound} />
                            </div>
                            <div className="flex items-center gap-6 mt-12">
                                <button onClick={() => timerDispatch(toggleTimer())} className="shadow-glow px-14 py-5 rounded-[2rem] font-black text-white text-sm tracking-[0.3em] transition-all" style={{ backgroundColor: accentColor }}>
                                    {reduxTimerState.isActive ? 'PAUSE SYSTEM' : 'START SESSION'}
                                </button>
                                <button onClick={() => {
                                    const d = reduxTimerState.mode === 'SHORT_BREAK' ? settingsItem.shortBreakDuration : reduxTimerState.mode === 'LONG_BREAK' ? settingsItem.longBreakDuration : settingsItem.focusDuration
                                    timerDispatch(resetTimer(d * 60)); reduxDispatch(setInitialTime(d * 60))
                                }} className="bg-white/5 hover:bg-white/10 p-5 border border-white/10 rounded-[1.8rem] text-white/40 hover:text-white transition-colors">
                                    <RotateCcw size={24} />
                                </button>
                            </div>
                        </section>
                        <section className="flex flex-col lg:col-span-5 h-full min-h-0"><TaskManager /></section>
                    </div>
                </div>
                <AnimatePresence>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bottom-6 left-6 z-50 absolute"><MusicWidget /></motion.div>
                </AnimatePresence>
            </main>
            {pipWindow && <PipPortal pipWindow={pipWindow} currentRound={currentRound} />}
            {/* <Toast isOpen={state.toast?.isOpen} message={state.toast?.message} onClose={() => timerDispatch({ type: 'HIDE_TOAST' })} /> */}
            <AnimatePresence>
                {isSettingsOpen && <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />}
                {isSupportOpen && <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />}
            </AnimatePresence>
        </motion.div>
    )
}
export default Dashboard