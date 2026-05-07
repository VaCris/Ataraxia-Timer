import { call, put, takeLatest, all } from 'redux-saga/effects'
import { authService } from '@api/auth/auth.service'
import { toast } from 'react-hot-toast'
import {
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
  logoutRequest
} from '../../../store/slices/authSlice'
import { fetchTagsRequest } from '../../tags/store/tagsSlice'
import { LoginDto, RegisterDto, GuestLoginDto, AuthResponse } from '@/features/auth/types/auth.dto'
const TOAST_ID = 'auth-status';

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator<any, void, any> {
  try {
    const res: any = yield call(authService.login, action.payload as LoginDto)

    //console.log("Server responded with:", res);

    const user = res.user || res.data?.user;
    const token = res.access_token || res.accessToken || res.token;
    const refresh = res.refresh_token || res.refreshToken;

    if (!user || !token) {
      throw new Error("The server response does not have the expected format (user or token missing).");
    }

    localStorage.setItem('token', token);
    if (refresh) localStorage.setItem('refreshToken', refresh);

    toast.success('Welcome back to Ataraxia', { id: TOAST_ID })

    yield put(loginSuccess({
      user: user,
      accessToken: token,
      refreshToken: refresh
    }));
    yield put(fetchTagsRequest());

  } catch (e: any) {
    console.error("Error en handleLogin:", e);
    const errorMsg = e.response?.data?.message || e.message || 'Login failed'
    toast.error(errorMsg, { id: TOAST_ID })
    yield put(loginFailure(errorMsg))
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>): Generator<any, void, AuthResponse> {
  try {
    const res: AuthResponse = yield call(authService.register, action.payload as RegisterDto)
    localStorage.setItem('token', res.access_token)

    toast.success('Your journey begins here', { id: TOAST_ID })
    yield put(registerSuccess({ user: res.user, accessToken: res.access_token }))
  } catch (e: any) {
    const errorMsg = e.response?.data?.message || 'Register failed'
    toast.error(errorMsg, { id: TOAST_ID })
    yield put(registerFailure(errorMsg))
  }
}

function* handleGuestLogin(action: ReturnType<typeof guestLoginRequest>): Generator<any, void, AuthResponse> {
  try {
    const res: AuthResponse = yield call(authService.guestLogin, action.payload as GuestLoginDto)

    if (res.user.deviceId) {
      localStorage.setItem('deviceId', res.user.deviceId);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    yield put(guestLoginSuccess({ user: res.user }))
  } catch (e: any) {
    yield put(guestLoginFailure(e.response?.data?.message || 'Guest access failed'))
  }
}

function* handleCheckAuth(): Generator<any, void, any> {
  try {
    const res: any = yield call(authService.getProfile);
    const userData = res.user || res;
    const token = res.access_token || res.accessToken || localStorage.getItem('token');
    const refresh = res.refresh_token || res.refreshToken || localStorage.getItem('refreshToken');

    if (!userData || (!userData.id && !userData._id)) {
      throw new Error("Formato de usuario no reconocido");
    }

    yield put(loginSuccess({
      user: userData,
      accessToken: token as string,
      refreshToken: refresh as string
    }));

  } catch (e: any) {
    console.error("CheckAuth falló:", e);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    yield put(loginFailure('Session expired'));
  }
}

function* handleLogout(): Generator {
  try {
    yield call(authService.logout);
  } catch (e) {
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('deviceId');

    toast.success('Sanctuary closed', { id: TOAST_ID });
    yield put(loginFailure('Logged out'));
  }
}

export default function* authSaga(): Generator {
  yield all([
    takeLatest(checkAuthRequest.type, handleCheckAuth),
    takeLatest(loginRequest.type, handleLogin),
    takeLatest(registerRequest.type, handleRegister),
    takeLatest(guestLoginRequest.type, handleGuestLogin),
    takeLatest(logoutRequest.type, handleLogout)
  ])
}