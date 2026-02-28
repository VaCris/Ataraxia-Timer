import { call, put, takeLatest, all } from 'redux-saga/effects';
import { achievementsService } from '../../api/achievements.service';
import {
    fetchStatsRequest, fetchStatsSuccess, fetchStatsFailure,
    fetchLeaderboardRequest, fetchLeaderboardSuccess, fetchLeaderboardFailure,
    fetchAchievementsRequest, fetchAchievementsSuccess, fetchAchievementsFailure,
    checkAchievementsRequest,
    registerActivityRequest
} from '../slices/achievementsSlice';
import { showToast } from '../../utils/customToast';

function* fetchStatsSaga() {
    try {
        const stats = yield call(achievementsService.getStats);
        yield put(fetchStatsSuccess(stats));
    } catch (error) {
        yield put(fetchStatsFailure(error.message));
    }
}

function* fetchLeaderboardSaga() {
    try {
        const leaderboard = yield call(achievementsService.getLeaderboard);
        yield put(fetchLeaderboardSuccess(leaderboard));
    } catch (error) {
        yield put(fetchLeaderboardFailure(error.message));
    }
}

function* fetchAchievementsSaga() {
    try {
        const items = yield call(achievementsService.getUnlockedAchievements);
        yield put(fetchAchievementsSuccess(items));
    } catch (error) {
        yield put(fetchAchievementsFailure(error.message));
    }
}

function* checkAchievementsSaga() {
    try {
        const newUnlocks = yield call(achievementsService.checkAchievements);
        if (newUnlocks && newUnlocks.length > 0) {
            yield put(fetchAchievementsRequest());
            showToast({
                title: 'New Achievements!',
                type: 'success',
                message: `You've unlocked ${newUnlocks.length} new achievements.`
            });
        }
    } catch (error) {
        console.error(error);
    }
}

function* registerActivitySaga(action) {
    try {
        yield call(achievementsService.registerActivity, action.payload);
        yield put(fetchStatsRequest());
        yield put(checkAchievementsRequest());
    } catch (error) {
        showToast({
            title: 'Activity Error',
            type: 'error',
            message: 'Daily activity could not be recorded.'
        });
    }
}

export function* achievementsSaga() {
    yield all([
        takeLatest(fetchStatsRequest.type, fetchStatsSaga),
        takeLatest(fetchLeaderboardRequest.type, fetchLeaderboardSaga),
        takeLatest(fetchAchievementsRequest.type, fetchAchievementsSaga),
        takeLatest(checkAchievementsRequest.type, checkAchievementsSaga),
        takeLatest(registerActivityRequest.type, registerActivitySaga)
    ]);
}