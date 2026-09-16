import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

const mocks = vi.hoisted(() => ({
  needRefresh: true,
  setNeedRefresh: vi.fn(),
  updateServiceWorker: vi.fn(),
  startVersionGuard: vi.fn(),
  registerOptions: null,
}))

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: (options) => {
    mocks.registerOptions = options
    return {
      needRefresh: [mocks.needRefresh, mocks.setNeedRefresh],
      updateServiceWorker: mocks.updateServiceWorker,
    }
  },
}))

vi.mock('@/shared/version/startVersionGuard', () => ({
  startVersionGuard: mocks.startVersionGuard,
}))

import UpdatePrompt from '@/app/components/UpdatePrompt'

describe('UpdatePrompt', () => {
  beforeEach(() => {
    mocks.needRefresh = true
    mocks.setNeedRefresh.mockReset()
    mocks.updateServiceWorker.mockReset()
    mocks.startVersionGuard.mockReset()
    mocks.registerOptions = null

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        appVersion: '2.0.0',
        changelog: ['Offline update safety'],
      }),
    }))
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('registers immediately and cleans up the version guard on unmount', () => {
    const guardCleanup = vi.fn()
    mocks.startVersionGuard.mockReturnValue(guardCleanup)

    const { unmount } = render(<UpdatePrompt />)
    const registration = { update: vi.fn() }

    expect(mocks.registerOptions?.immediate).toBe(true)
    mocks.registerOptions?.onRegisteredSW('/sw.js', registration)
    expect(mocks.startVersionGuard).toHaveBeenCalledWith(registration)

    unmount()
    expect(guardCleanup).toHaveBeenCalledTimes(1)
  })

  it('lets the user explicitly activate or defer a waiting service worker', async () => {
    render(<UpdatePrompt />)

    expect(await screen.findByText('v2.0.0')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Update Now' }))
    expect(mocks.updateServiceWorker).toHaveBeenCalledWith(true)

    fireEvent.click(screen.getByRole('button', { name: 'Later' }))
    expect(mocks.setNeedRefresh).toHaveBeenCalledWith(false)
  })
})
