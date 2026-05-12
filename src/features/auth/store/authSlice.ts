import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '@/features/auth/types/auth.dto'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  status: AuthStatus
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  status: localStorage.getItem('token') ? 'loading' : 'idle',
  error: null,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuthRequest: (state) => {
      state.status = 'loading'
      state.error = null
    },

    loginRequest: (
      state,
      _action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.status = 'loading'
      state.error = null
    },

    loginSuccess: (
      state,
      action: PayloadAction<{
        user: AuthUser
        accessToken: string
        refreshToken?: string | null
      }>
    ) => {
      state.status = 'authenticated'
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken || null
      state.error = null
    },

    loginFailure: (state, action: PayloadAction<string>) => {
      state.status = 'error'
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.error = action.payload
    },

    registerRequest: (
      state,
      _action: PayloadAction<{
        username: string
        email: string
        password: string
        deviceId?: string
      }>
    ) => {
      state.status = 'loading'
      state.error = null
    },

    registerSuccess: (
      state,
      action: PayloadAction<{
        user: AuthUser
        accessToken: string
        refreshToken?: string | null
      }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken || null
      state.status = 'authenticated'
      state.error = null
    },

    registerFailure: (state, action: PayloadAction<string>) => {
      state.status = 'error'
      state.error = action.payload
    },

    guestLoginRequest: (
      state,
      _action: PayloadAction<{ deviceId: string }>
    ) => {
      state.status = 'loading'
      state.error = null
    },

    guestLoginSuccess: (
      state,
      action: PayloadAction<{
        user: AuthUser
        accessToken?: string | null
      }>
    ) => {
      state.status = 'authenticated'
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken || null
      state.refreshToken = null
      state.error = null
    },

    guestLoginFailure: (state, action: PayloadAction<string>) => {
      state.status = 'error'
      state.error = action.payload
    },

    forgotPasswordRequest: (
      state,
      _action: PayloadAction<{ email: string }>
    ) => {
      state.status = 'loading'
      state.error = null
    },

    forgotPasswordSuccess: (state) => {
      state.status = 'idle'
      state.error = null
    },

    forgotPasswordFailure: (state, action: PayloadAction<string>) => {
      state.status = 'error'
      state.error = action.payload
    },

    resetPasswordRequest: (
      state,
      _action: PayloadAction<{ token: string; newPassword: string }>
    ) => {
      state.status = 'loading'
      state.error = null
    },

    resetPasswordSuccess: (state) => {
      state.status = 'idle'
      state.error = null
    },

    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.status = 'error'
      state.error = action.payload
    },

    logoutRequest: (state) => {
      state.status = 'loading'
    },

    logoutSuccess: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.status = 'idle'
      state.error = null
    },

    logoutFailure: (state, action: PayloadAction<string>) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.status = 'idle'
      state.error = action.payload
    },
  },
})

export const {
  checkAuthRequest,
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  guestLoginRequest,
  guestLoginSuccess,
  guestLoginFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} = slice.actions

export default slice.reducer