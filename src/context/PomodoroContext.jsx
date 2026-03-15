import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAudio } from './AudioContext';
import { createTimerRequest } from '@store/slices/timerSlice';

const PomodoroContext = createContext();

const initialState = {
    mode: 'FOCUS',
    timeLeft: 25 * 60,
    isActive: false,
    settings: {
        FOCUS: 25,
        SHORT_BREAK: 5,
        LONG_BREAK: 15,
    },
    toast: {
        isOpen: false,
        message: '',
        type: 'xp'
    },
    music: {
        isPlaying: false,
        currentTrack: {
            title: "Lofi Focus Beats",
            artist: "Ataraxia Radio",
            cover: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=300&h=300&fit=crop"
        },
        volume: 50
    },
};

function reducer(state, action) {
    switch (action.type) {
        case 'TICK':
            return { ...state, timeLeft: state.timeLeft - 1 };
        case 'TOGGLE_TIMER':
            return { ...state, isActive: !state.isActive };
        case 'START_TIMER':
            return { ...state, isActive: true };
        case 'SET_MODE':
            return {
                ...state,
                mode: action.payload,
                timeLeft: state.settings[action.payload] * 60,
                isActive: false
            };
        case 'RESET_TIMER':
            return { ...state, timeLeft: state.settings[state.mode] * 60, isActive: false };
        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...state.settings, ...action.payload } };
        default:
            return state;
    }
}

export const PomodoroProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const reduxDispatch = useDispatch(); // Hook para enviar acciones a Redux Saga

    // Obtenemos configuración del estado global de Redux
    const { autoStartBreak, autoStartFocus } = useSelector(state => state.settings) || {};
    const { masterVolume, alarmVolume } = useAudio();

    const handleSwitchMode = useCallback((nextMode) => {
        dispatch({ type: 'SET_MODE', payload: nextMode });
        if (nextMode === 'FOCUS' && autoStartFocus) {
            dispatch({ type: 'START_TIMER' });
        } else if ((nextMode === 'SHORT_BREAK' || nextMode === 'LONG_BREAK') && autoStartBreak) {
            dispatch({ type: 'START_TIMER' });
        }
    }, [autoStartFocus, autoStartBreak]);

    const playAlarm = () => {
        const alarm = new Audio('/sounds/alarm-digital.mp3');
        alarm.volume = masterVolume * alarmVolume;
        alarm.play().catch(err => console.log("Waiting for user interaction to sound...", err));
    };

    // Lógica principal del temporizador y conexión con Redux Saga
    useEffect(() => {
        let interval = null;
        if (state.isActive && state.timeLeft > 0) {
            interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
        } else if (state.timeLeft === 0 && state.isActive) {
            // 1. Detener temporizador local
            dispatch({ type: 'TOGGLE_TIMER' });
            playAlarm();

            // 2. DISPARAR ACCIÓN A REDUX SAGA PARA GUARDAR EN DB
            // Solo guardamos si es modo FOCUS (trabajo)
            if (state.mode === 'FOCUS') {
                reduxDispatch(createTimerRequest({
                    type: 'work',
                    duration: state.settings.FOCUS,
                    timestamp: new Date().toISOString()
                }));
            }
        }
        return () => clearInterval(interval);
    }, [state.isActive, state.timeLeft, state.mode, state.settings.FOCUS, reduxDispatch]);

    // Atajos de teclado
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    dispatch({ type: 'TOGGLE_TIMER' });
                    break;
                case 'KeyR':
                    dispatch({ type: 'RESET_TIMER' });
                    break;
                case 'Digit1':
                    handleSwitchMode('FOCUS');
                    break;
                case 'Digit2':
                    handleSwitchMode('SHORT_BREAK');
                    break;
                case 'Digit3':
                    handleSwitchMode('LONG_BREAK');
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSwitchMode]);

    return (
        <PomodoroContext.Provider value={{ state, dispatch, handleSwitchMode }}>
            {children}
        </PomodoroContext.Provider>
    );
};

export const usePomodoro = () => useContext(PomodoroContext);