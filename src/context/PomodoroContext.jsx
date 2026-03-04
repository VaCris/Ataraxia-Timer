import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAudio } from './AudioContext';

const PomodoroContext = createContext();

const initialState = {
    mode: 'FOCUS',
    timeLeft: 25 * 60,
    isActive: false,
    tags: JSON.parse(localStorage.getItem('tags')) || [
        { name: 'General', color: '#8b5cf6' },
        { name: 'Work', color: '#3b82f6' },
        { name: 'Study', color: '#10b981' }
    ],
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    stats: JSON.parse(localStorage.getItem('stats')) || {
        xp: 0,
        level: 1,
        sessionsCompleted: 0,
        tasksCompleted: 0,
        streak: 0,
    },
    settings: JSON.parse(localStorage.getItem('settings')) || {
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
        case 'SET_MODE':
            return {
                ...state,
                mode: action.payload,
                timeLeft: state.settings[action.payload] * 60,
                isActive: false
            };
        case 'RESET_TIMER':
            return { ...state, timeLeft: state.settings[state.mode] * 60, isActive: false };
        case 'SHOW_TOAST':
            return {
                ...state,
                toast: { isOpen: true, message: action.payload.message, type: action.payload.type || 'xp' }
            };
        case 'HIDE_TOAST':
            return {
                ...state,
                toast: { ...state.toast, isOpen: false }
            };
        case 'TOGGLE_PLAY':
            return { ...state, music: { ...state.music, isPlaying: !state.music.isPlaying } };
        case 'ADD_TASK':
            const tagExists = state.tags.find(t => t.name.toLowerCase() === action.payload.tag.toLowerCase());
            const newTags = tagExists
                ? state.tags
                : [...state.tags, { name: action.payload.tag, color: action.payload.tagColor }];
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
                tags: newTags
            };
        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
        case 'TOGGLE_TASK':
            const isCompleting = !state.tasks.find(t => t.id === action.payload).completed;
            return {
                ...state,
                tasks: state.tasks.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t),
                stats: {
                    ...state.stats,
                    tasksCompleted: isCompleting ? state.stats.tasksCompleted + 1 : state.stats.tasksCompleted - 1,
                    xp: isCompleting ? state.stats.xp + 50 : Math.max(0, state.stats.xp - 50)
                }
            };

        case 'COMPLETE_SESSION':
            const xpGained = state.mode === 'FOCUS' ? 25 : 5;
            const totalXp = state.stats.xp + xpGained;
            return {
                ...state,
                isActive: false,
                stats: {
                    ...state.stats,
                    xp: totalXp,
                    level: Math.floor(totalXp / 100) + 1,
                    sessionsCompleted: state.mode === 'FOCUS' ? state.stats.sessionsCompleted + 1 : state.stats.sessionsCompleted
                }
            };

        case 'UPDATE_SETTINGS':
            return { ...state, settings: { ...state.settings, ...action.payload } };

        default:
            return state;
    }
}

export const PomodoroProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { autoStartBreak, autoStartFocus } = useSelector(state => state.settings);
    const { masterVolume, alarmVolume } = useAudio();

    const handleSwitchMode = (nextMode) => {
        dispatch({ type: 'SET_MODE', payload: nextMode });
        if (nextMode === 'FOCUS' && autoStartFocus) {
            dispatch({ type: 'START_TIMER' });
        } else if ((nextMode === 'SHORT_BREAK' || nextMode === 'LONG_BREAK') && autoStartBreak) {
            dispatch({ type: 'START_TIMER' });
        }
    };

    const playAlarm = () => {
        const alarm = new Audio('/sounds/alarm-digital.mp3');
        alarm.volume = masterVolume * alarmVolume;
        alarm.play().catch(err => console.log("Waiting for user interaction to sound...", err));
    };

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
        localStorage.setItem('stats', JSON.stringify(state.stats));
        localStorage.setItem('settings', JSON.stringify(state.settings));
    }, [state.tasks, state.stats, state.settings]);

    useEffect(() => {
        let interval = null;
        if (state.isActive && state.timeLeft > 0) {
            interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
        } else if (state.timeLeft === 0 && state.isActive) {
            dispatch({ type: 'COMPLETE_SESSION' });
        }
        return () => clearInterval(interval);
    }, [state.isActive, state.timeLeft]);

    return (
        <PomodoroContext.Provider value={{ state, dispatch }}>
            {children}
        </PomodoroContext.Provider>
    );
};

export const usePomodoro = () => useContext(PomodoroContext);