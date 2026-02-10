import { call, put, takeLatest, select, debounce } from 'redux-saga/effects';
import toast from 'react-hot-toast';
import { settingsService } from '../../api/settings.service';
import {
    fetchSettingsRequest, fetchSettingsSuccess, fetchSettingsFailure,
    updateSettings, updateTimerSettings
} from '../slices/settingsSlice';

function* fetchSettingsSaga() {
    try {
        const settings = yield call(settingsService.getSettings);
        yield put(fetchSettingsSuccess(settings));
    } catch (error) {
        console.warn("Error fetching settings:", error);
        yield put(fetchSettingsFailure(error.message));
    }
}

function* saveSettingsSaga() {
    try {
        const state = yield select(state => state.settings);
        const { timerSettings, autoStart, longBreakInterval, accentColor, bgImage , is24Hour} = state;

        localStorage.setItem('dw-color', accentColor);
        if (bgImage) {
            localStorage.setItem('dw-background', bgImage);
        } else {
            localStorage.removeItem('dw-background');
        }

        const payload = {
            focusDuration: Number(timerSettings.work),
            shortBreakDuration: Number(timerSettings.short),
            longBreakDuration: Number(timerSettings.long),
            longBreakInterval: Number(longBreakInterval),
            autoStartPomodoros: Boolean(autoStart),
            theme: 'dark',
            platform: 'web'
        };

        yield call(settingsService.saveSettings, payload);
        toast.success('Settings synced'); 

    } catch (error) {
        console.error("Auto-save failed", error);
        if (error.code === "ERR_NETWORK") {
            toast.error("Offline: Settings saved locally", { id: 'network-error' });
        }
    }
}

export function* settingsSaga() {
    yield takeLatest(fetchSettingsRequest.type, fetchSettingsSaga);
    yield debounce(1000, [
        updateSettings.type,
        updateTimerSettings.type
    ], saveSettingsSaga);
}