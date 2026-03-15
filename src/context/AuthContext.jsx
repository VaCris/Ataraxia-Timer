import React, { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
    checkAuthRequest,
    loginRequest,
    registerRequest,
    logoutRequest
} from '@store/slices/authSlice'
import LogoSVG from '@assets/pwa-192x192.svg'

const AuthContext = createContext(null)

const SENECA_QUOTES = [
    "It is not that we have a short time to live, but that we waste a lot of it.",
    "True happiness is to enjoy the present, without anxious dependence upon the future.",
    "Sometimes even to live is an act of courage.",
    "Luck is what happens when preparation meets opportunity.",
    "No man is more unhappy than he who never faces adversity.",
    "Your mind is your most valuable possession. Protect it.",
    "Initializing serenity protocols...",
    "Establishing Ataraxia state..."
]

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch()

    // Obtenemos el estado real de Redux
    const { user, status, error: authError } = useSelector(state => state.auth)
    const isAuthenticated = status === 'authenticated'

    const [loadingUI, setLoadingUI] = useState(true)
    const [currentQuote, setCurrentQuote] = useState(0)

    // 1. Manejo de las frases de Séneca
    useEffect(() => {
        let interval
        if (loadingUI) {
            interval = setInterval(() => {
                setCurrentQuote(p => (p + 1) % SENECA_QUOTES.length)
            }, 3000)
        }
        return () => clearInterval(interval)
    }, [loadingUI])

    // 2. INICIALIZACIÓN BLINDADA (Fix doble disparo)
    useEffect(() => {
        const initAtaraxia = async () => {
            const token = localStorage.getItem('token');
            const deviceId = localStorage.getItem('deviceId');

            // UX: Queremos que vean al menos una frase de Séneca (2.5s)
            const minWait = new Promise(r => setTimeout(r, 2500));

            // REGLA: Solo disparamos checkAuth si estamos en 'idle' y hay algo que validar
            // Esto evita que React Strict Mode dispare dos peticiones paralelas
            if (token && status === 'idle') {
                dispatch(checkAuthRequest());
            }

            await minWait;

            // Solo quitamos el splash screen cuando la Saga haya terminado (o no haya nada que cargar)
            // Si el status sigue en 'loading', esperamos a que cambie.
            if (status !== 'loading') {
                setLoadingUI(false);
            }
        }

        initAtaraxia();
    }, [dispatch, status]); // Escuchamos status para saber cuándo la Saga terminó

    const login = (email, password) => dispatch(loginRequest({ email, password }))
    const register = (userData) => dispatch(registerRequest(userData))
    const logout = () => dispatch(logoutRequest())

    // 3. RENDER DEL LOADING (Se mantiene mientras se inicializa o mientras la Saga trabaja)
    if (loadingUI || (status === 'loading' && !user)) {
        return (
            <div className="flex flex-col justify-center items-center bg-[#050505] px-6 w-screen h-screen overflow-hidden">
                <div className="relative flex justify-center items-center mb-16 w-48 h-48">
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-accent/20 blur-[90px] rounded-full"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="z-10 relative"
                    >
                        <motion.img
                            src={LogoSVG}
                            alt="Ataraxia Logo"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="drop-shadow-[0_0_25px_rgba(var(--color-accent-rgb),0.4)] brightness-110 w-28 h-28 object-contain"
                        />
                    </motion.div>
                </div>

                <div className="flex flex-col items-center max-w-lg text-center">
                    <div className="flex justify-center items-center h-20">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentQuote}
                                initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
                                transition={{ duration: 0.9 }}
                                className="font-medium text-white/60 text-base md:text-lg italic leading-relaxed"
                            >
                                "{SENECA_QUOTES[currentQuote]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col items-center gap-5 mt-12">
                        <span className="ml-[1em] font-black text-[10px] text-white/10 uppercase tracking-[1em]">
                            STARTING ATARAXIA...
                        </span>
                        <div className="relative bg-white/5 rounded-full w-56 h-[1px] overflow-hidden">
                            <motion.div
                                initial={{ left: "-100%" }}
                                animate={{ left: "100%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_10px_var(--color-accent)] w-2/3"
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            login,
            register,
            logout,
            error: authError,
            loading: loadingUI || status === 'loading'
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}