import { takeLatest, put, select, delay, call, take, race, takeEvery } from 'redux-saga/effects';
import {
    startTimer, pauseTimer, resetTimer, tick,
    switchMode, incrementCycles, setConfig
} from '../slices/timerSlice';
import { timersService } from '../../api/timers.service';

const playAlarm = (volume) => {
    try {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = volume;
        audio.play().catch(e => console.error("Audio play failed", e));
    } catch (error) {
        console.error({ error: "Audio error" });
    }
};

function* runTimerSaga() {
    while (true) {
        const { isActive, timeLeft } = yield select(state => state.timer);

        if (!isActive) break;

        if (timeLeft <= 0) {
            yield call(handleTimerComplete);
            break;
        }

        yield delay(1000);
        yield put(tick());
    }
}

function* handleTimerComplete() {
    const { mode, settings, cycles, longBreakInterval, autoStart, volume } = yield select(state => state.timer);
    yield call(playAlarm, volume);

    if (mode === 'work') {
        yield put(incrementCycles());
        const nextCycleCount = Number(cycles) + 1;
        const interval = Number(longBreakInterval) || 4;

        if (nextCycleCount % interval === 0) {
            yield put(switchMode('long'));
        } else {
            yield put(switchMode('short'));
        }

        try {
            const duration = settings.work * 60;
            const sessionData = {
                duration,
                tag: 'Focus',
                status: 'completed',
                startTime: new Date(Date.now() - duration * 1000).toISOString(),
                createdAt: new Date().toISOString()
            };
            yield call(timersService.saveSession, sessionData);
            window.dispatchEvent(new CustomEvent('timer:completed'));
        } catch (error) {
            console.warn("Error saving session data");
        }
    } else {
        yield put(switchMode('work'));
    }

    if (autoStart) {
        yield delay(500);
        yield put(startTimer());
    }
}

function* saveStateSaga() {
    const state = yield select(state => state.timer);
    localStorage.setItem('timer_state', JSON.stringify(state));
}

export function* timerSaga() {
    yield takeLatest(startTimer.type, runTimerSaga);

    yield takeEvery([
        tick.type, startTimer.type, pauseTimer.type,
        resetTimer.type, switchMode.type, setConfig.type,
        incrementCycles.type
    ], saveStateSaga);
}