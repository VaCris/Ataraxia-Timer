import { all } from 'redux-saga/effects';
import { watchAuth } from './sagas/authSaga';

export function* rootSaga() {
    yield all([
        watchAuth(),
    ]);
}