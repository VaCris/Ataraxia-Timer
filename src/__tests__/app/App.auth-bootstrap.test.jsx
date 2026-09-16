import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'
import { checkAuthRequest } from '@/features/auth/store/authSlice'

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  processSyncQueue: vi.fn(async () => undefined),
}))

vi.mock('react-redux', () => ({
  useDispatch: () => mocks.dispatch,
}))

vi.mock('@/infrastructure/sync/syncManager', () => ({
  processSyncQueue: mocks.processSyncQueue,
}))

vi.mock('@/shared/ui/feedback/Loader', () => ({
  Loader: () => null,
}))

vi.mock('react-hot-toast', () => ({
  Toaster: () => null,
}))

describe('App auth bootstrap', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.dispatch.mockClear()
    mocks.processSyncQueue.mockClear()
  })

  it('checks local authentication state on boot even when no remote access token exists', async () => {
    localStorage.setItem('ataraxia_local_profile', JSON.stringify({
      id: 'local-user',
      name: 'Local User',
    }))

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mocks.dispatch).toHaveBeenCalledWith(checkAuthRequest())
    })
  })
})
