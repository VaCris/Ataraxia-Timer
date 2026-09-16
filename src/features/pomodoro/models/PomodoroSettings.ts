export type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export interface PomodoroSettings {
    pomodoroLength: number;
    shortBreakLength: number;
    longBreakLength: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
}

export interface PomodoroState {
    mode: TimerMode;
    isActive: boolean;
    timeLeft: number;
    initialTime: number;
}
