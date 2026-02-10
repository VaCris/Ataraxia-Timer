import { call, take, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { syncManager } from '../../api/sync.manager';

function createNetworkChannel() {
    return eventChannel(emit => {
        const handleOnline = () => emit(true);
        const handleOffline = () => emit(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    });
}

function* watchNetwork() {
    const channel = yield call(createNetworkChannel);
    while (true) {
        const isOnline = yield take(channel);
        if (isOnline) {
            console.log('Network detected: Starting synchronization...');
            yield call([syncManager, 'syncAll']);
        }
    }
}

export function* syncSaga() {
    yield fork(watchNetwork);
}