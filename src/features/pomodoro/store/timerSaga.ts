import { call, put, takeLatest } from 'redux-saga/effects'
import { timersService } from '@/features/pomodoro/api/timers.api'
import type { TimerResponse } from '@/features/pomodoro/types/timer.dto'
import {
    createTimerRequest,
    createTimerSuccess,
    createTimerFailure
} from '@/features/pomodoro/store/timersSlice'

function* createTimerSaga(
    action: ReturnType<typeof createTimerRequest>
): Generator {
    try {
        const res = (yield call(() => timersService.create(action.payload))) as TimerResponse
        yield put(createTimerSuccess(res))
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        yield put(createTimerFailure(message))
    }
}

export default function* timerSaga(): Generator {
    yield takeLatest(createTimerRequest.type, createTimerSaga)
}
