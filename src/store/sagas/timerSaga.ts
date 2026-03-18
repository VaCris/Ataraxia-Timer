import { call, put, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { timersService } from '@api/timers/timers.service'
import {
    createTimerRequest,
    createTimerSuccess,
    createTimerFailure
} from '../slices/timersSlice'

type CreateTimerPayload = {
    duration: number
    taskId?: string
}

function* createTimerSaga(
    action: PayloadAction<CreateTimerPayload>
): Generator<any, void, any> {
    try {
        const res = yield call(timersService.create, action.payload)
        yield put(createTimerSuccess(res))
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        yield put(createTimerFailure(message))
    }
}

export default function* timerSaga(): Generator {
    yield takeLatest(createTimerRequest.type, createTimerSaga)
}