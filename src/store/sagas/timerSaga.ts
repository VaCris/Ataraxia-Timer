import { call, put, takeLatest } from 'redux-saga/effects'
import { timersService } from '@api/timers/timers.service'
import { toast } from 'react-hot-toast'
import {
    fetchTimersRequest, fetchTimersSuccess, fetchTimersFailure,
    createTimerRequest, createTimerSuccess, createTimerFailure,
    updateTimerRequest, updateTimerSuccess, updateTimerFailure,
    deleteTimerRequest, deleteTimerSuccess, deleteTimerFailure
} from '../slices/timerSlice'
import { TimerResponse } from '@api/timers/dto/timer.dto'

function* handleFetchTimers(): Generator<any, void, TimerResponse[]> {
    try {
        const data: TimerResponse[] = yield call(timersService.getAll)
        yield put(fetchTimersSuccess(data))
    } catch (e: any) {
        yield put(fetchTimersFailure(e.message))
    }
}

function* handleCreateTimer(action: ReturnType<typeof createTimerRequest>): Generator<any, void, TimerResponse> {
    try {
        const data: TimerResponse = yield call(timersService.create, action.payload);
        yield put(createTimerSuccess(data));
        toast.success("Session successfully saved");
    } catch (e: any) {
        if (e.message === 'OFFLINE_SAVED') {
            yield put(createTimerFailure("Offline Mode")); 
            toast.success("Session saved locally! It will be uploaded when you have internet access again", {
                icon: '💾',
                duration: 5000
            });
        } else {
            yield put(createTimerFailure(e.message));
            toast.error("Session could not be saved");
        }
    }
}

function* handleUpdateTimer(action: ReturnType<typeof updateTimerRequest>): Generator<any, void, TimerResponse> {
    try {
        const updated: TimerResponse = yield call(timersService.update, action.payload.id, action.payload.data)
        yield put(updateTimerSuccess(updated))
    } catch (e: any) {
        yield put(updateTimerFailure(e.message))
    }
}

function* handleDeleteTimer(action: ReturnType<typeof deleteTimerRequest>): Generator<any, void, void> {
    try {
        yield call(timersService.delete, action.payload)
        yield put(deleteTimerSuccess(action.payload))
    } catch (e: any) {
        yield put(deleteTimerFailure(e.message))
    }
}

export default function* timerSaga(): Generator {
    yield takeLatest(fetchTimersRequest.type, function* () {
        try {
            const data: TimerResponse[] = yield call(timersService.getAll)
            yield put(fetchTimersSuccess(data))
        } catch (e: any) {
            yield put(fetchTimersFailure(e.message))
        }
    })
    yield takeLatest(createTimerRequest.type, handleCreateTimer)
    yield takeLatest(updateTimerRequest.type, handleUpdateTimer)
    yield takeLatest(deleteTimerRequest.type, handleDeleteTimer)
}