import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { runSaga, stdChannel } from 'redux-saga'
import authSaga from '@/features/auth/store/authSaga'
import {
  checkAuthRequest,
  loginSuccess,
} from '@/features/auth/store/authSlice'

const mocks = vi.hoisted(() => ({
  getRemoteProfile: vi.fn(),
  getLocalProfile: vi.fn(),
  saveLocalProfile: vi.fn(),
  clearLocalProfile: vi.fn(),
}))

vi.mock('@/features/auth/api/auth.api', () => ({
  authService: {
    getProfile: mocks.getRemoteProfile,
    login: vi.fn(),
    register: vi.fn(),
    guestLogin: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    logout: vi.fn(),
  },
}))

vi.mock('@/features/auth/repositories/auth.local.repository', () => ({
  authLocalRepository: {
    getProfile: mocks.getLocalProfile,
    saveProfile: mocks.saveLocalProfile,
    clearProfile: mocks.clearLocalProfile,
  },
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const localUser = {
  id: 'local-user',
  name: 'Local User',
  email: 'local@example.test',
  isGuest: false,
}

const setOnline = (online: boolean) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: online,
  })
}

const runCheckAuth = async () => {
  const channel = stdChannel()
  const dispatched: Array<{ type: string; payload?: unknown }> = []
  const task = runSaga(
    {
      channel,
      dispatch: (action: { type: string; payload?: unknown }) => {
        dispatched.push(action)
      },
    },
    authSaga
  )

  await Promise.resolve()
  channel.put(checkAuthRequest())

  await vi.waitFor(() => {
    expect(dispatched.some((action) => action.type === loginSuccess.type)).toBe(true)
  })

  task.cancel()
  await task.toPromise().catch(() => undefined)
  return dispatched
}

describe('authSaga local session restoration', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.getRemoteProfile.mockReset()
    mocks.getLocalProfile.mockReset()
    mocks.saveLocalProfile.mockReset()
    mocks.clearLocalProfile.mockReset()
    mocks.getLocalProfile.mockReturnValue(localUser)
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('restores a known local profile while offline with an expired remote token', async () => {
    localStorage.setItem('token', 'expired-token')
    setOnline(false)

    const dispatched = await runCheckAuth()

    expect(mocks.getRemoteProfile).not.toHaveBeenCalled()
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: null,
      refreshToken: null,
      isRemoteSessionAvailable: false,
    }))
  })

  it('restores a known local profile without requiring a remote token', async () => {
    setOnline(true)

    const dispatched = await runCheckAuth()

    expect(mocks.getRemoteProfile).not.toHaveBeenCalled()
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: null,
      refreshToken: null,
      isRemoteSessionAvailable: false,
    }))
  })

  it('uses the remote profile when a valid online session is available', async () => {
    localStorage.setItem('token', 'valid-token')
    setOnline(true)
    mocks.getRemoteProfile.mockResolvedValue({ user: localUser })

    const dispatched = await runCheckAuth()

    expect(mocks.getRemoteProfile).toHaveBeenCalledTimes(1)
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: 'valid-token',
      refreshToken: null,
      isRemoteSessionAvailable: true,
    }))
  })
})
