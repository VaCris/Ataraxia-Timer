import { call, put, takeLatest } from 'redux-saga/effects';

import { settingsLocalRepository } from '@/features/settings/repositories/settings.local.repository';
import { addToSyncQueue, processSyncQueue } from '@/infrastructure/sync/syncManager';
import {
  fetchSettingsRequest,
  fetchSettingsSuccess,
  fetchSettingsFailure,
  updateSettingsRequest,
  updateSettingsSuccess,
  updateSettingsFailure,
} from './settingsSlice';

function* fetchSettingsSaga(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem('token');
    
    if (token && navigator.onLine) {
      yield call(processSyncQueue);
    }
    
    let localSettings = yield call([settingsLocalRepository, settingsLocalRepository.get]);
    
    if (localSettings) {
      const migrated = {
        ...localSettings,
        pomodoroLength: localSettings.pomodoroLength ?? (localSettings as any).focusDuration ?? 25,
        shortBreakLength: localSettings.shortBreakLength ?? (localSettings as any).shortBreakDuration ?? 5,
        longBreakLength: localSettings.longBreakLength ?? (localSettings as any).longBreakDuration ?? 15,
      };
      if (
        migrated.pomodoroLength !== localSettings.pomodoroLength ||
        migrated.shortBreakLength !== localSettings.shortBreakLength ||
        migrated.longBreakLength !== localSettings.longBreakLength
      ) {
        yield call([settingsLocalRepository, settingsLocalRepository.save], migrated);
        localSettings = migrated;
      }
    }
    
    if (!localSettings) {
      localSettings = {
        id: 'me',
        pomodoroLength: 25,
        shortBreakLength: 5,
        longBreakLength: 15,
        longBreakInterval: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        theme: 'dark',
        soundEnabled: true,
        volume: 50,
        language: 'en',
        timeFormat: '24h',
        weekStart: 'monday',
        notificationsEnabled: true,
      };
      yield call([settingsLocalRepository, settingsLocalRepository.save], localSettings);
    }

    yield put(fetchSettingsSuccess(localSettings));
  } catch (error: any) {
    yield put(
      fetchSettingsFailure(
        error.response?.data?.message || error.message || 'Error fetching settings'
      )
    );
  }
}

function* updateSettingsSaga(
  action: ReturnType<typeof updateSettingsRequest>
): Generator<any, void, any> {
  try {
    const updatedSettings = yield call(
      [settingsLocalRepository, settingsLocalRepository.update],
      action.payload
    );

    yield call(addToSyncQueue, {
      method: 'PATCH',
      url: '/settings/me',
      entity: 'settings',
      entityId: 'me',
      data: updatedSettings,
    });

    yield put(updateSettingsSuccess(updatedSettings));
    
    if (navigator.onLine) {
      yield call(processSyncQueue);
    }
  } catch (error: any) {
    yield put(
      updateSettingsFailure(
        error.message || 'Error updating settings'
      )
    );
  }
}

export default function* settingsSaga(): Generator {
  yield takeLatest(fetchSettingsRequest.type, fetchSettingsSaga);
  yield takeLatest(updateSettingsRequest.type, updateSettingsSaga);
}
