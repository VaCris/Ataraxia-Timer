import { call, put, takeLatest, all } from 'redux-saga/effects';
import { toast } from 'react-hot-toast';

import { authService } from '@/features/auth/api/auth.api';
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
  logoutFailure,
} from './authSlice';
import { fetchTagsRequest } from '@/features/tags/store/tagsSlice';
import { fetchTasksRequest } from '@/features/tasks/store/tasksSlice';
import { fetchSettingsRequest } from '@/features/settings/store/settingsSlice';
import { clearTasks } from '@/features/tasks/store/tasksSlice';
import { clearTags } from '@/features/tags/store/tagsSlice';
import {
  LoginDto,
  RegisterDto,
  GuestLoginDto,
  AuthResponse,
} from '@/features/auth/types/auth.dto';

const TOAST_ID = 'auth-status';

function* handleLogin(
  action: ReturnType<typeof loginRequest>
): Generator<any, void, any> {
  try {
    const res: any = yield call(authService.login, action.payload as LoginDto);

    const fallbackUser = res.user || res.data?.user;
    const token = res.access_token || res.accessToken || res.token;
    const refresh = res.refresh_token || res.refreshToken;

    if (!fallbackUser || !token) {
      throw new Error('The server response does not have the expected format.');
    }

    localStorage.setItem('token', token);

    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }

    const profileRes: any = yield call(authService.getProfile);

    const profileUser =
      profileRes.user ||
      profileRes.data?.user ||
      profileRes ||
      fallbackUser;

    yield put(
      loginSuccess({
        user: profileUser,
        accessToken: token,
        refreshToken: refresh,
      })
    );

    yield put(fetchTagsRequest());
    yield put(fetchTagsRequest());
    yield put(fetchTasksRequest());
    yield put(fetchSettingsRequest());

    toast.success('Welcome back to Ataraxia', { id: TOAST_ID });
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Login failed';

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

    const token = res.access_token;
    const refresh = res.refresh_token;

    if (token) {
      localStorage.setItem('token', token);
    }

    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }

    yield put(
      registerSuccess({
        user: res.user,
        accessToken: token,
        refreshToken: refresh,
      })
    );

    toast.success('Your journey begins here', { id: TOAST_ID });
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Register failed';

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

    if (res.user?.deviceId) {
      localStorage.setItem('deviceId', res.user.deviceId);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    yield put(
      guestLoginSuccess({
        user: res.user,
        accessToken: res.access_token,
      })
    );
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'Guest access failed';

    yield put(guestLoginFailure(message));
  }
}

function* handleCheckAuth(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      yield put(logoutSuccess());
      return;
    }

    const res: any = yield call(authService.getProfile);

    const user = res.user || res.data?.user || res;
    const accessToken = res.access_token || res.accessToken || token;
    const refreshToken =
      res.refresh_token ||
      res.refreshToken ||
      localStorage.getItem('refreshToken');

    if (!user || (!user.id && !user._id)) {
      throw new Error('Unrecognized user format in server response.');
    }

    yield put(
      loginSuccess({
        user,
        accessToken,
        refreshToken,
      })
    );
  } catch (error: any) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    yield put(loginFailure(error.message || 'Session expired'));
  }
}

function* handleForgotPassword(
  action: ReturnType<typeof forgotPasswordRequest>
): Generator<any, void, any> {
  try {
    yield call(authService.forgotPassword, {
      email: action.payload.email.trim().toLowerCase(),
    });

    yield put(forgotPasswordSuccess());

    toast.success('Password reset link sent to your email', { id: TOAST_ID });
  } catch (error: any) {
    const backendMessage = error.response?.data?.message;

    const message =
      backendMessage === 'Error técnico enviando el correo.'
        ? 'No se pudo enviar el correo de recuperación. Inténtalo más tarde.'
        : backendMessage || error.message || 'Could not send password reset email';

    yield put(forgotPasswordFailure(message));
    toast.error(message, { id: TOAST_ID });
  }
}

function* handleResetPassword(
  action: ReturnType<typeof resetPasswordRequest>
): Generator<any, void, any> {
  try {
    yield call(authService.resetPassword, action.payload);

    yield put(resetPasswordSuccess());

    toast.success('Password updated successfully', { id: TOAST_ID });
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Could not reset password';

    yield put(resetPasswordFailure(message));
    toast.error(message, { id: TOAST_ID });
  }
}

function* handleLogout(): Generator<any, void, any> {
  try {
    yield call(authService.logout);

    toast.success('Session closed', { id: TOAST_ID });
  } catch (error: any) {
    console.error('Logout failed:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('deviceId');

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