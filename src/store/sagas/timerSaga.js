import { takeLatest, put, select, delay, call, take, race, takeEvery } from 'redux-saga/effects';
import {
    startTimer, pauseTimer, resetTimer, tick,
    switchMode, incrementCycles, setConfig
} from '../slices/timerSlice';
import { setPlaying } from '../slices/musicSlice';
import { timersService } from '../../api/timers.service';

const playAlarm = (volume) => {
    try {
        const audio = new Audio('/sounds/alarm.mp3');
        audio.volume = volume;
        audio.play().catch(e => console.error("Audio play failed", e));
    } catch (e) {
        console.error("Audio error", e);
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
    yield put(setPlaying(false));
    if (mode === 'work') {
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
            yield put(incrementCycles());
        } catch (error) {
            console.error("Failed to save session:", error);
        }

        const newCycles = cycles + 1;
        if (newCycles % longBreakInterval === 0) {
            yield put(switchMode('long'));
        } else {
            yield put(switchMode('short'));
        }
    } else {
        yield put(switchMode('work'));
    }

    if (autoStart) {
        yield put(startTimer());
    }
}

function* saveStateSaga() {
    const state = yield select(state => state.timer);
    localStorage.setItem('timer_state', JSON.stringify(state));
}

export function* timerSaga() {
    yield takeLatest(startTimer.type, runTimerSaga);
    yield takeEvery(pauseTimer.type, function* () {
        yield put(setPlaying(false));
    });
    yield takeEvery([
        tick.type, startTimer.type, pauseTimer.type,
        resetTimer.type, switchMode.type, setConfig.type
    ], saveStateSaga);
}