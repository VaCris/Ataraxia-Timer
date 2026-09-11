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

describe('API refresh coordination', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.post.mockReset()
    setOnline(true)
  })

  it('shares one refresh request across concurrent callers', async () => {
    localStorage.setItem('refreshToken', 'refresh-old')

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
        refresh_token: 'refresh-new',
      },
    })

    await expect(first).resolves.toBe(true)
    await expect(second).resolves.toBe(true)
    expect(localStorage.getItem('token')).toBe('access-new')
    expect(localStorage.getItem('refreshToken')).toBe('refresh-new')
  })

  it('clears only remote tokens when refresh fails', async () => {
    localStorage.setItem('token', 'access-old')
    localStorage.setItem('refreshToken', 'refresh-old')
    localStorage.setItem('ataraxia_local_profile', '{"id":"local-user"}')
    mocks.post.mockRejectedValue(new Error('refresh failed'))

    await expect(tryRefresh()).resolves.toBe(false)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(localStorage.getItem('ataraxia_local_profile')).toBe('{"id":"local-user"}')
  })

  it('does not contact the backend while offline', async () => {
    setOnline(false)
    localStorage.setItem('refreshToken', 'refresh-old')

    await expect(tryRefresh()).resolves.toBe(false)

    expect(mocks.post).not.toHaveBeenCalled()
    expect(localStorage.getItem('refreshToken')).toBe('refresh-old')
  })
})
