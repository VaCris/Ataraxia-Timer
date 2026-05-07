import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingResponse, UpdateSettingDto, CreateSettingDto } from '@/features/settings/types/setting.dto';
import { UISettings } from '../types';

export interface SettingsState {
    api: SettingResponse | null;
    items: SettingResponse[];
    ui: UISettings;
    status: 'idle' | 'loading' | 'error';
    error: string | null;
}

const initialUISettings: UISettings = {
    theme: 'system',
    accentColor: '#e11d48',
    bgImage: null,
    blurIntensity: 0,
    volume: 50,
    isMuted: false,
    pipEnabled: true,
};

const initialState: SettingsState = {
    api: null,
    items: [],
    ui: initialUISettings,
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
        hydrateUISettings: (state, action: PayloadAction<UISettings>) => {
            state.ui = action.payload;
        },

        fetchSettingsRequest: (state) => { 
            state.status = 'loading'; 
            state.error = null; 
        },
        fetchSettingsSuccess: (state, action: PayloadAction<SettingResponse>) => { 
            state.status = 'idle'; 
            state.api = action.payload; 
        },
        fetchSettingsFailure: (state, action: PayloadAction<string>) => { 
            state.status = 'error'; 
            state.error = action.payload; 
        },

        fetchAllSettingsRequest: (state) => { 
            state.status = 'loading'; 
            state.error = null; 
        },
        fetchAllSettingsSuccess: (state, action: PayloadAction<SettingResponse[]>) => { 
            state.status = 'idle'; 
            state.items = action.payload; 
        },
        fetchAllSettingsFailure: (state, action: PayloadAction<string>) => { 
            state.status = 'error'; 
            state.error = action.payload; 
        },

        createSettingsRequest: (state, _action: PayloadAction<CreateSettingDto>) => { 
            state.status = 'loading'; 
            state.error = null; 
        },
        createSettingsSuccess: (state, action: PayloadAction<SettingResponse>) => { 
            state.status = 'idle'; 
            state.api = action.payload; 
        },
        createSettingsFailure: (state, action: PayloadAction<string>) => { 
            state.status = 'error'; 
            state.error = action.payload; 
        },

        updateSettingsRequest: (state, _action: PayloadAction<UpdateSettingDto>) => { 
            state.status = 'loading'; 
            state.error = null; 
        },
        updateSettingsSuccess: (state, action: PayloadAction<SettingResponse>) => { 
            state.status = 'idle'; 
            state.api = action.payload; 
        },
        updateSettingsFailure: (state, action: PayloadAction<string>) => { 
            state.status = 'error'; 
            state.error = action.payload; 
        },

        deleteSettingsRequest: (state, _action: PayloadAction<string>) => { 
            state.status = 'loading'; 
            state.error = null; 
        },
        deleteSettingsSuccess: (state) => { 
            state.status = 'idle'; 
            state.api = null; 
        },
        deleteSettingsFailure: (state, action: PayloadAction<string>) => { 
            state.status = 'error'; 
            state.error = action.payload; 
        },

        adminUpdateSettingsRequest: (state, _action: PayloadAction<{ id: string; data: UpdateSettingDto }>) => { 
            state.status = 'loading'; 
            state.error = null; 
        },
        adminUpdateSettingsSuccess: (state, action: PayloadAction<SettingResponse>) => { 
            state.status = 'idle'; 
            state.api = action.payload; 
        },
        adminUpdateSettingsFailure: (state, action: PayloadAction<string>) => { 
            state.status = 'error'; 
            state.error = action.payload; 
        }
    }
});

export const {
    updateUISettings,
    hydrateUISettings,
    fetchSettingsRequest,
    fetchSettingsSuccess,
    fetchSettingsFailure,
    fetchAllSettingsRequest,
    fetchAllSettingsSuccess,
    fetchAllSettingsFailure,
    createSettingsRequest,
    createSettingsSuccess,
    createSettingsFailure,
    updateSettingsRequest,
    updateSettingsSuccess,
    updateSettingsFailure,
    deleteSettingsRequest,
    deleteSettingsSuccess,
    deleteSettingsFailure,
    adminUpdateSettingsRequest,
    adminUpdateSettingsSuccess,
    adminUpdateSettingsFailure
} = settingsSlice.actions;

export default settingsSlice.reducer;