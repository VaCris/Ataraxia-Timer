import { describe, it, expect } from 'vitest';
import reducer, {
  setMode,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  resetTimer,
  tick,
  updateDurations,
  showToast,
  hideToast,
  Mode,
} from '@/features/pomodoro/store/timerSlice';

describe('timerSlice reducer', () => {
  const initialState = {
    mode: 'FOCUS' as Mode,
    isActive: false,
    isPaused: false,
    timeLeft: 25 * 60,
    initialTime: 25 * 60,
    toast: { isOpen: false, message: '' },
    serverId: undefined,
  };

  it('should return the initial state when passed an empty action', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should handle setMode', () => {
    const nextState = reducer(initialState, setMode('SHORT_BREAK'));
    expect(nextState.mode).toBe('SHORT_BREAK');
  });

  it('should handle startTimer', () => {
    const nextState = reducer(initialState, startTimer());
    expect(nextState.isActive).toBe(true);
    expect(nextState.isPaused).toBe(false);
  });

  it('should handle pauseTimer', () => {
    const activeState = { ...initialState, isActive: true, isPaused: false };
    const nextState = reducer(activeState, pauseTimer());
    expect(nextState.isActive).toBe(false);
    expect(nextState.isPaused).toBe(true);
  });

  it('should handle resumeTimer when timeLeft > 0', () => {
    const pausedState = { ...initialState, isActive: false, isPaused: true, timeLeft: 1200 };
    const nextState = reducer(pausedState, resumeTimer());
    expect(nextState.isActive).toBe(true);
    expect(nextState.isPaused).toBe(false);
  });

  it('should not handle resumeTimer when timeLeft is 0', () => {
    const zeroState = { ...initialState, isActive: false, isPaused: true, timeLeft: 0 };
    const nextState = reducer(zeroState, resumeTimer());
    expect(nextState.isActive).toBe(false);
    expect(nextState.isPaused).toBe(true);
  });

  it('should handle stopTimer', () => {
    const activeState = { ...initialState, isActive: true, isPaused: false };
    const nextState = reducer(activeState, stopTimer());
    expect(nextState.isActive).toBe(false);
    expect(nextState.isPaused).toBe(false);
  });

  it('should handle resetTimer', () => {
    const nextState = reducer(initialState, resetTimer(15 * 60));
    expect(nextState.isActive).toBe(false);
    expect(nextState.isPaused).toBe(false);
    expect(nextState.initialTime).toBe(15 * 60);
    expect(nextState.timeLeft).toBe(15 * 60);
    expect(nextState.serverId).toBeUndefined();
  });

  it('should handle tick (decrementing time)', () => {
    const activeState = { ...initialState, timeLeft: 1500 };
    const nextState = reducer(activeState, tick());
    expect(nextState.timeLeft).toBe(1499);
  });

  it('should not decrement time below 0 on tick', () => {
    const zeroState = { ...initialState, timeLeft: 0 };
    const nextState = reducer(zeroState, tick());
    expect(nextState.timeLeft).toBe(0);
  });

  it('should handle updateDurations', () => {
    const nextState = reducer(initialState, updateDurations({ mode: 'LONG_BREAK', duration: 15 }));
    expect(nextState.mode).toBe('LONG_BREAK');
    expect(nextState.isActive).toBe(false);
    expect(nextState.isPaused).toBe(false);
    expect(nextState.initialTime).toBe(15 * 60);
    expect(nextState.timeLeft).toBe(15 * 60);
  });

  it('should handle showToast and hideToast', () => {
    let nextState = reducer(initialState, showToast('Focus finished!'));
    expect(nextState.toast.isOpen).toBe(true);
    expect(nextState.toast.message).toBe('Focus finished!');

    nextState = reducer(nextState, hideToast());
    expect(nextState.toast.isOpen).toBe(false);
  });
});
