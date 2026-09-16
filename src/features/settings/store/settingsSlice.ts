import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingResponseDto, UpdateSettingDto } from '@/features/settings/types/setting.dto';
import { UISettings } from '../types';
import { INITIAL_UI_SETTINGS } from '../constants/settings.constants';

export interface SettingsState {
    api: SettingResponseDto | null;
    ui: UISettings;
    status: 'idle' | 'loading' | 'error';
    error: string | null;
}

const getFallbackApiSettings = (current: SettingResponseDto | null): SettingResponseDto => ({
    id: current?.id || '',
    pomodoroLength: current?.pomodoroLength ?? (current as any)?.focusDuration ?? 25,
    shortBreakLength: current?.shortBreakLength ?? (current as any)?.shortBreakDuration ?? 5,
    longBreakLength: current?.longBreakLength ?? (current as any)?.longBreakDuration ?? 15,
    longBreakInterval: current?.longBreakInterval ?? 4,
    autoStartBreaks: current?.autoStartBreaks ?? false,
    autoStartPomodoros: current?.autoStartPomodoros ?? false,
    soundEnabled: current?.soundEnabled ?? true,
    volume: current?.volume ?? 50,
    theme: current?.theme ?? 'dark',
    language: current?.language ?? 'en',
    timeFormat: current?.timeFormat ?? '24h',
    weekStart: current?.weekStart ?? 'monday',
    notificationsEnabled: current?.notificationsEnabled ?? true,
});

const initialState: SettingsState = {
    api: null,
    ui: INITIAL_UI_SETTINGS,
    status: 'idle',
    error: null,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateUISettings: (state, action: PayloadAction<Partial<UISettings>>) => {
            state.ui = { ...state.ui, ...action.payload };
        },
        hydrateUISettings: (state, action: PayloadAction<Partial<UISettings>>) => {
            state.ui = { ...state.ui, ...action.payload };
        },

        fetchSettingsRequest: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        fetchSettingsSuccess: (state, action: PayloadAction<SettingResponseDto>) => {
            state.status = 'idle';
            state.api = action.payload;
        },
        fetchSettingsFailure: (state, action: PayloadAction<string>) => {
            state.status = 'error';
            state.error = action.payload;
        },

        updateSettingsRequest: (state, action: PayloadAction<UpdateSettingDto>) => {
            state.status = 'loading';
            state.error = null;
            state.api = {
                ...getFallbackApiSettings(state.api),
                ...action.payload,
            };
        },
        updateSettingsSuccess: (state, action: PayloadAction<SettingResponseDto>) => {
            state.status = 'idle';
            state.api = action.payload;
        },
        updateSettingsFailure: (state, action: PayloadAction<string>) => {
            state.status = 'error';
            state.error = action.payload;
        },
    }
});

export const {
    updateUISettings,
    hydrateUISettings,
    fetchSettingsRequest,
    fetchSettingsSuccess,
    fetchSettingsFailure,
    updateSettingsRequest,
    updateSettingsSuccess,
    updateSettingsFailure,
} = settingsSlice.actions;

export default settingsSlice.reducer;
