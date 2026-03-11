import { call, put, takeLatest, all } from 'redux-saga/effects'
import { authService } from '@api/auth/auth.service'
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  guestLoginRequest,
  guestLoginSuccess,
  guestLoginFailure
} from '../slices/authSlice'
import { LoginDto, RegisterDto, GuestLoginDto, AuthResponse } from '@api/auth/dto/auth.dto'

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator<any, void, AuthResponse> {
  try {
    const res: AuthResponse = yield call(authService.login, action.payload as LoginDto)
    yield put(loginSuccess({
      user: res.user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token
    }))
  } catch (e: any) {
    yield put(loginFailure(e.response?.data?.message || 'Login failed'))
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>): Generator<any, void, AuthResponse> {
  try {
    const res: AuthResponse = yield call(authService.register, action.payload as RegisterDto)
    yield put(registerSuccess({
      user: res.user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token
    }))
  } catch (e: any) {
    yield put(registerFailure(e.response?.data?.message || 'Register failed'))
  }
}

function* handleGuestLogin(action: ReturnType<typeof guestLoginRequest>): Generator<any, void, AuthResponse> {
  try {
    const res: AuthResponse = yield call(authService.guestLogin, action.payload as GuestLoginDto)
    yield put(guestLoginSuccess({
      user: res.user,
      accessToken: res.access_token
    }))
  } catch (e: any) {
    yield put(guestLoginFailure(e.response?.data?.message || 'Guest login failed'))
  }
}

export default function* authSaga(): Generator {
  yield all([
    takeLatest(loginRequest.type, handleLogin),
    takeLatest(registerRequest.type, handleRegister),
    takeLatest(guestLoginRequest.type, handleGuestLogin)
  ])
}