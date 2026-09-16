import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

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

const ensureMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement(attributes.tagName || 'meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([name, value]) => {
    if (name !== 'tagName') element.setAttribute(name, value)
  })

  return element
}

const seedHomeMetadata = () => {
  document.title = 'Ataraxia Timer | Pomodoro Focus Timer & Task Manager'
  ensureMeta('meta[name="description"]', {
    name: 'description',
    content: 'Ataraxia Timer home description',
  })
  ensureMeta('meta[name="robots"]', {
    name: 'robots',
    content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  })
  ensureMeta('meta[property="og:url"]', {
    property: 'og:url',
    content: 'https://ataraxiatimer.app/',
  })
  ensureMeta('link[rel="canonical"]', {
    tagName: 'link',
    rel: 'canonical',
    href: 'https://ataraxiatimer.app/',
  })
}

describe('App route SEO metadata', () => {
  beforeEach(() => {
    localStorage.clear()
    mocks.dispatch.mockClear()
    mocks.processSyncQueue.mockClear()
    document.head.innerHTML = ''
    seedHomeMetadata()
  })

  it('uses dedicated indexable metadata for the privacy page', async () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(document.title).toBe('Privacy Policy | Ataraxia Timer')
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'))
        .toBe('https://ataraxiatimer.app/privacy')
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content'))
        .toContain('index, follow')
      expect(document.head.querySelector('meta[property="og:url"]')?.getAttribute('content'))
        .toBe('https://ataraxiatimer.app/privacy')
    })
  })

  it('uses dedicated indexable metadata for the terms page', async () => {
    render(
      <MemoryRouter initialEntries={['/terms']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(document.title).toBe('Terms & Conditions | Ataraxia Timer')
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'))
        .toBe('https://ataraxiatimer.app/terms')
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content'))
        .toContain('index, follow')
    })
  })

  it('marks reset-password as noindex and gives it its own canonical URL', async () => {
    render(
      <MemoryRouter initialEntries={['/reset-password']}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(document.title).toBe('Reset Password | Ataraxia Timer')
      expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'))
        .toBe('https://ataraxiatimer.app/reset-password')
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content'))
        .toBe('noindex, nofollow')
    })
  })
})
