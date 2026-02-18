import { takeLatest, call, put, all } from 'redux-saga/effects';
import { achievementsService } from '../../api/achievements.service';
import {
    fetchAchievementsRequest,
    fetchLeaderboardRequest,
    fetchDataSuccess,
    fetchLeaderboardSuccess,
    fetchError
} from '../slices/achievementsSlice';

function* handleFetchAchievements() {
    try {
        const data = yield call(achievementsService.getMyProgress);
        yield put(fetchDataSuccess(data));
    } catch (error) {
        yield put(fetchError(error.message));
    }
}

function* handleFetchLeaderboard() {
    try {
        const data = yield call(achievementsService.getLeaderboard, { sortBy: 'experience', limit: 10 });
        yield put(fetchLeaderboardSuccess(data));
    } catch (error) {
        yield put(fetchError(error.message));
    }
}

export function* achievementsSaga() {
    yield all([
        takeLatest(fetchAchievementsRequest.type, handleFetchAchievements),
        takeLatest(fetchLeaderboardRequest.type, handleFetchLeaderboard),
    ]);
}