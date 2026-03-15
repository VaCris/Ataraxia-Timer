import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthUser } from '@/api/auth/dto/auth.dto'
import { Check } from 'lucide-react'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'idle',
  error: null
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuthRequest: (s) => {
      s.status = 'loading'
    },

    loginRequest: (s, _a: PayloadAction<{ email: string; password: string }>) => {
      s.status = 'loading'
      s.error = null
    },

    loginSuccess: (s, a: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken?: string }>) => {
      s.status = 'authenticated'
      s.user = a.payload.user
      s.accessToken = a.payload.accessToken
      s.refreshToken = a.payload.refreshToken || null
      s.error = null
    },

    loginFailure: (s, a: PayloadAction<string>) => {
      s.status = 'error'
      s.error = a.payload
    },

    registerRequest: (s, _a: PayloadAction<{ username: string; email: string; password: string; deviceId?: string }>) => {
      s.status = 'loading'
      s.error = null
    },

    registerSuccess: (s, a: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken?: string }>) => {
      s.user = a.payload.user
      s.accessToken = a.payload.accessToken
      s.refreshToken = a.payload.refreshToken || null
      s.status = 'authenticated'
    },

    registerFailure: (s, a: PayloadAction<string>) => {
      s.status = 'error'
      s.error = a.payload
    },

    guestLoginRequest: (s, _a: PayloadAction<{ deviceId: string }>) => {
      s.status = 'loading'
      s.error = null
    },

    guestLoginSuccess: (s, a: PayloadAction<{ user: AuthUser; accessToken?: string }>) => {
      s.status = 'authenticated';
      s.user = a.payload.user;
      s.error = null;
    },

    guestLoginFailure: (s, a: PayloadAction<string>) => {
      s.status = 'error'
      s.error = a.payload
    },

    forgotPasswordRequest: (s, _a: PayloadAction<{ email: string }>) => {
      s.status = 'loading'
      s.error = null
    },

    forgotPasswordSuccess: (s) => {
      s.status = 'idle'
    },

    forgotPasswordFailure: (s, a: PayloadAction<string>) => {
      s.status = 'error'
      s.error = a.payload
    },

    resetPasswordRequest: (s, _a: PayloadAction<{ token: string; newPassword: string }>) => {
      s.status = 'loading'
      s.error = null
    },

    resetPasswordSuccess: (s) => {
      s.status = 'idle'
    },

    resetPasswordFailure: (s, a: PayloadAction<string>) => {
      s.status = 'error'
      s.error = a.payload
    },

    logoutRequest: (s) => {
      s.status = 'loading'
    },

    logoutSuccess: (s) => {
      s.user = null
      s.accessToken = null
      s.refreshToken = null
      s.status = 'idle'
    },

    logoutFailure: (s, a: PayloadAction<string>) => {
      s.status = 'error'
      s.error = a.payload
    }
  }
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
  logoutFailure
} = slice.actions

export default slice.reducer