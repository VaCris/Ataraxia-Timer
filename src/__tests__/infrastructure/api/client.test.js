import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const requestUse = vi.fn()
  const responseUse = vi.fn()
  const client = Object.assign(vi.fn(), {
    defaults: { baseURL: 'https://api.example.test' },
    interceptors: {
      request: { use: requestUse },
      response: { use: responseUse },
    },
  })

  return {
    post: vi.fn(),
    create: vi.fn(() => client),
    client,
    requestUse,
    responseUse,
  }
})

vi.mock('axios', () => ({
  default: {
    create: mocks.create,
    post: mocks.post,
  },
}))

vi.mock('axios-rate-limit', () => ({
  default: (client) => client,
}))

import { tryRefresh } from '@/infrastructure/api/client'

const setOnline = (online) => {
  Object.defineProperty(window.navigator, 'onLine', {
    configurable: true,
    value: online,
  })
}

const getResponseErrorHandler = () => mocks.responseUse.mock.calls[0]?.[1]

describe('API refresh coordination', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.post.mockReset()
    mocks.client.mockReset()
    setOnline(true)
  })

  it('refreshes with the HttpOnly cookie and never persists a refresh token', async () => {
    mocks.post.mockResolvedValue({
      data: {
        access_token: 'access-new',
        refresh_token: 'body-refresh-ignored',
      },
    })

    await expect(tryRefresh()).resolves.toBe(true)

    expect(mocks.post).toHaveBeenCalledWith(
      'https://api.example.test/auth/refresh',
      undefined,
      { withCredentials: true }
    )
    expect(localStorage.getItem('token')).toBe('access-new')
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })

  it('shares one refresh request across concurrent callers', async () => {
    let resolveRefresh
    mocks.post.mockReturnValue(new Promise((resolve) => {
      resolveRefresh = resolve
    }))

    const first = tryRefresh()
    const second = tryRefresh()

    expect(mocks.post).toHaveBeenCalledTimes(1)

    resolveRefresh({
      data: {
        access_token: 'access-new',
      },
    })

    await expect(first).resolves.toBe(true)
    await expect(second).resolves.toBe(true)
    expect(localStorage.getItem('token')).toBe('access-new')
  })

  it('coordinates concurrent 401 responses through a single active refresh', async () => {
    localStorage.setItem('token', 'access-old')

    let resolveRefresh
    mocks.post.mockReturnValue(new Promise((resolve) => {
      resolveRefresh = resolve
    }))
    mocks.client.mockResolvedValue({ data: { ok: true } })

    const handleError = getResponseErrorHandler()
    expect(handleError).toBeTypeOf('function')

    const requestA = { url: '/tasks', headers: {} }
    const requestB = { url: '/tags', headers: {} }

    const first = handleError({ config: requestA, response: { status: 401 } })
    const second = handleError({ config: requestB, response: { status: 401 } })

    expect(mocks.post).toHaveBeenCalledTimes(1)

    resolveRefresh({ data: { access_token: 'access-new' } })

    await expect(first).resolves.toEqual({ data: { ok: true } })
    await expect(second).resolves.toEqual({ data: { ok: true } })
    expect(requestA.headers.Authorization).toBe('Bearer access-new')
    expect(requestB.headers.Authorization).toBe('Bearer access-new')
    expect(mocks.client).toHaveBeenCalledTimes(2)
  })

  it('clears only the remote access token when refresh fails', async () => {
    localStorage.setItem('token', 'access-old')
    localStorage.setItem('ataraxia_local_profile', '{"id":"local-user"}')
    mocks.post.mockRejectedValue(new Error('refresh failed'))

    await expect(tryRefresh()).resolves.toBe(false)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(localStorage.getItem('ataraxia_local_profile')).toBe('{"id":"local-user"}')
  })

  it('does not contact the backend while offline', async () => {
    setOnline(false)

    await expect(tryRefresh()).resolves.toBe(false)

    expect(mocks.post).not.toHaveBeenCalled()
  })

  it('does not refresh or logout on HTTP 500', async () => {
    const handleError = getResponseErrorHandler()
    expect(handleError).toBeTypeOf('function')

    const error = { config: { url: '/tasks', headers: {} }, response: { status: 500 } }

    await expect(handleError(error)).rejects.toBe(error)
    expect(mocks.post).not.toHaveBeenCalled()
    expect(localStorage.getItem('token')).toBeNull()
  })
})
