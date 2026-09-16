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
  tryRefresh: vi.fn(),
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

vi.mock('@/infrastructure/api/client', () => ({
  tryRefresh: mocks.tryRefresh,
  default: {},
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
    mocks.tryRefresh.mockReset()
    mocks.tryRefresh.mockResolvedValue(false)
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

    expect(mocks.tryRefresh).not.toHaveBeenCalled()
    expect(mocks.getRemoteProfile).not.toHaveBeenCalled()
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: null,
      isRemoteSessionAvailable: false,
    }))
  })

  it('falls back to a known local profile when cookie refresh is unavailable', async () => {
    setOnline(true)

    const dispatched = await runCheckAuth()

    expect(mocks.tryRefresh).toHaveBeenCalledTimes(1)
    expect(mocks.getRemoteProfile).not.toHaveBeenCalled()
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: null,
      isRemoteSessionAvailable: false,
    }))
  })

  it('restores the remote session from the HttpOnly refresh cookie when no access token exists', async () => {
    setOnline(true)
    mocks.tryRefresh.mockImplementation(async () => {
      localStorage.setItem('token', 'refreshed-token')
      return true
    })
    mocks.getRemoteProfile.mockResolvedValue({ user: localUser })

    const dispatched = await runCheckAuth()

    expect(mocks.tryRefresh).toHaveBeenCalledTimes(1)
    expect(mocks.getRemoteProfile).toHaveBeenCalledTimes(1)
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: 'refreshed-token',
      isRemoteSessionAvailable: true,
    }))
  })

  it('uses the remote profile when a valid online access token is available', async () => {
    localStorage.setItem('token', 'valid-token')
    setOnline(true)
    mocks.getRemoteProfile.mockResolvedValue({ user: localUser })

    const dispatched = await runCheckAuth()

    expect(mocks.tryRefresh).not.toHaveBeenCalled()
    expect(mocks.getRemoteProfile).toHaveBeenCalledTimes(1)
    expect(dispatched).toContainEqual(loginSuccess({
      user: localUser,
      accessToken: 'valid-token',
      isRemoteSessionAvailable: true,
    }))
  })
})
