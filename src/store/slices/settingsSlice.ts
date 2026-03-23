import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SettingResponse, UpdateSettingDto, CreateSettingDto } from '@api/settings/dto/settings.dto'

type SettingsState = {
  item: SettingResponse | null
  items: SettingResponse[]
  status: 'idle' | 'loading' | 'error'
  error: string | null
}

const loadLocalSettings = (): SettingResponse | null => {
  try {
    const data = localStorage.getItem('ataraxia_settings')
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

const initialState: SettingsState = {
  item: loadLocalSettings(),
  items: [],
  status: 'idle',
  error: null
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchSettingsRequest: (s) => { s.status = 'loading'; s.error = null },
    fetchSettingsSuccess: (s, a: PayloadAction<SettingResponse>) => { s.status = 'idle'; s.item = a.payload },
    fetchSettingsFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

    fetchAllSettingsRequest: (s) => { s.status = 'loading'; s.error = null },
    fetchAllSettingsSuccess: (s, a: PayloadAction<SettingResponse[]>) => { s.status = 'idle'; s.items = a.payload },
    fetchAllSettingsFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

    createSettingsRequest: (s, _a: PayloadAction<CreateSettingDto>) => { s.status = 'loading'; s.error = null },
    createSettingsSuccess: (s, a: PayloadAction<SettingResponse>) => { s.status = 'idle'; s.item = a.payload },
    createSettingsFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

    updateSettingsRequest: (s, _a: PayloadAction<UpdateSettingDto>) => { s.status = 'loading'; s.error = null },
    updateSettingsSuccess: (s, a: PayloadAction<SettingResponse>) => { s.status = 'idle'; s.item = a.payload },
    updateSettingsFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

    deleteSettingsRequest: (s, _a: PayloadAction<string>) => { s.status = 'loading'; s.error = null },
    deleteSettingsSuccess: (s) => { s.status = 'idle'; s.item = null },
    deleteSettingsFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload },

    adminUpdateSettingsRequest: (s, _a: PayloadAction<{ id: string; data: UpdateSettingDto }>) => { s.status = 'loading'; s.error = null },
    adminUpdateSettingsSuccess: (s, a: PayloadAction<SettingResponse>) => { s.status = 'idle'; s.item = a.payload },
    adminUpdateSettingsFailure: (s, a: PayloadAction<string>) => { s.status = 'error'; s.error = a.payload }
  }
})

export const {
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
} = slice.actions

export default slice.reducer