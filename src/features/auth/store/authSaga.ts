import { call, put, takeLatest, all } from 'redux-saga/effects';
import { toast } from 'react-hot-toast';

import { authService } from '@/features/auth/api/auth.api';
import { authLocalRepository } from '@/features/auth/repositories/auth.local.repository';
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
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
  logoutRequest,
  logoutSuccess,
} from './authSlice';
import { fetchTagsRequest } from '@/features/tags/store/tagsSlice';
import { fetchTasksRequest } from '@/features/tasks/store/tasksSlice';
import { fetchSettingsRequest } from '@/features/settings/store/settingsSlice';
import { clearTasks } from '@/features/tasks/store/tasksSlice';
import { clearTags } from '@/features/tags/store/tagsSlice';
import type {
  LoginDto,
  RegisterDto,
  GuestLoginDto,
  AuthResponse,
  AuthUser,
} from '@/features/auth/types/auth.dto';

const TOAST_ID = 'auth-status';

const persistRemoteTokens = (accessToken?: string | null, refreshToken?: string | null) => {
  if (accessToken) localStorage.setItem('token', accessToken);
  else localStorage.removeItem('token');

  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
  else localStorage.removeItem('refreshToken');
};

function* hydrateCoreData(): Generator<any, void, any> {
  yield put(fetchTagsRequest());
  yield put(fetchTasksRequest());
  yield put(fetchSettingsRequest());
}

function* handleLogin(
  action: ReturnType<typeof loginRequest>
): Generator<any, void, any> {
  try {
    const res: AuthResponse = yield call(authService.login, action.payload as LoginDto);
    const user = res.user;
    const token = res.access_token;
    const refresh = res.refresh_token;

    if (!user || !token) {
      throw new Error('The server response does not have the expected format.');
    }

    persistRemoteTokens(token, refresh);
    authLocalRepository.saveProfile(user);

    yield put(loginSuccess({
      user,
      accessToken: token,
      refreshToken: refresh,
      isRemoteSessionAvailable: true,
    }));

    yield call(hydrateCoreData);
    toast.success('Welcome back to Ataraxia', { id: TOAST_ID });
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    yield put(loginFailure(message));
    toast.error(message, { id: TOAST_ID });
  }
}

function* handleRegister(
  action: ReturnType<typeof registerRequest>
): Generator<any, void, any> {
  try {
    const res: AuthResponse = yield call(
      authService.register,
      action.payload as RegisterDto
    );

    persistRemoteTokens(res.access_token, res.refresh_token);
    authLocalRepository.saveProfile(res.user);

    yield put(registerSuccess({
      user: res.user,
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
    }));

    yield call(hydrateCoreData);
    toast.success('Your journey begins here', { id: TOAST_ID });
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Register failed';
    yield put(registerFailure(message));
    toast.error(message, { id: TOAST_ID });
  }
}

function* handleGuestLogin(
  action: ReturnType<typeof guestLoginRequest>
): Generator<any, void, any> {
  try {
    const res: AuthResponse = yield call(
      authService.guestLogin,
      action.payload as GuestLoginDto
    );

    if (res.user?.deviceId) localStorage.setItem('deviceId', res.user.deviceId);
    persistRemoteTokens(res.access_token, res.refresh_token);
    authLocalRepository.saveProfile(res.user);

    yield put(guestLoginSuccess({
      user: res.user,
      accessToken: res.access_token,
    }));

    yield call(hydrateCoreData);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Guest access failed';
    yield put(guestLoginFailure(message));
  }
}

function* restoreLocalSession(user: AuthUser): Generator<any, void, any> {
  yield put(loginSuccess({
    user,
    accessToken: null,
    refreshToken: null,
    isRemoteSessionAvailable: false,
  }));
  yield call(hydrateCoreData);
}

function* handleCheckAuth(): Generator<any, void, any> {
  const localUser = authLocalRepository.getProfile();
  const token = localStorage.getItem('token');

  if (!navigator.onLine) {
    if (localUser) {
      yield call(restoreLocalSession, localUser);
    } else {
      yield put(logoutSuccess());
    }
    return;
  }

  if (!token) {
    if (localUser) {
      yield call(restoreLocalSession, localUser);
    } else {
      yield put(logoutSuccess());
    }
    return;
  }

  try {
    const res: any = yield call(authService.getProfile);
    const user: AuthUser = res.user || res.data?.user || res;

    if (!user?.id) throw new Error('Unrecognized user format in server response.');

    authLocalRepository.saveProfile(user);

    yield put(loginSuccess({
      user,
      accessToken: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken'),
      isRemoteSessionAvailable: true,
    }));
    yield call(hydrateCoreData);
  } catch (error: any) {
    if (localUser) {
      yield call(restoreLocalSession, localUser);
      return;
    }

    const message = error.response?.data?.message || error.message || 'Session expired';
    yield put(loginFailure(message));
  }
}

function* handleForgotPassword(
  action: ReturnType<typeof forgotPasswordRequest>
): Generator<any, void, any> {
  try {
    if (!navigator.onLine) throw new Error('Internet connection is required to recover your password.');

    yield call(authService.forgotPassword, {
      email: action.payload.email.trim().toLowerCase(),
    });
    yield put(forgotPasswordSuccess());
    toast.success('Password reset link sent to your email', { id: TOAST_ID });
  } catch (error: any) {
    const backendMessage = error.response?.data?.message;
    const message =
      backendMessage === 'Error técnico enviando el correo.' || backendMessage === 'Technical error sending email.'
        ? 'Could not send recovery email. Try again later.'
        : backendMessage || error.message || 'Could not send password reset email';

    yield put(forgotPasswordFailure(message));
    toast.error(message, { id: TOAST_ID });
  }
}

function* handleResetPassword(
  action: ReturnType<typeof resetPasswordRequest>
): Generator<any, void, any> {
  try {
    if (!navigator.onLine) throw new Error('Internet connection is required to reset your password.');

    yield call(authService.resetPassword, action.payload);
    yield put(resetPasswordSuccess());
    toast.success('Password updated successfully', { id: TOAST_ID });
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Could not reset password';
    yield put(resetPasswordFailure(message));
    toast.error(message, { id: TOAST_ID });
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    if (navigator.onLine && localStorage.getItem('token')) {
      yield call(authService.logout);
    }
  } catch (error) {
    console.error('Remote logout failed:', error);
  } finally {
    persistRemoteTokens(null, null);
    localStorage.removeItem('deviceId');
    authLocalRepository.clearProfile();

    yield put(clearTasks());
    yield put(clearTags());
    yield put(logoutSuccess());
  }
}

export default function* authSaga(): Generator {
  yield all([
    takeLatest(checkAuthRequest.type, handleCheckAuth),
    takeLatest(loginRequest.type, handleLogin),
    takeLatest(registerRequest.type, handleRegister),
    takeLatest(guestLoginRequest.type, handleGuestLogin),
    takeLatest(forgotPasswordRequest.type, handleForgotPassword),
    takeLatest(resetPasswordRequest.type, handleResetPassword),
    takeLatest(logoutRequest.type, handleLogout),
  ]);
}
