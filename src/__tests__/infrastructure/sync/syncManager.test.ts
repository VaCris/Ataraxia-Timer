import { afterEach, describe, expect, it, vi } from 'vitest'
import { classifySyncError, getSyncBackoffMs } from '@/infrastructure/sync/syncManager'

describe('syncManager error classification', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('blocks authentication failures without classifying them as permanent data loss', () => {
    expect(classifySyncError({ response: { status: 401 } })).toBe('blocked_auth')
    expect(classifySyncError({ response: { status: 403 } })).toBe('blocked_auth')
  })

  it('keeps transient server, rate-limit and network failures retryable', () => {
    expect(classifySyncError({ response: { status: 500 } })).toBe('retrying')
    expect(classifySyncError({ response: { status: 429 } })).toBe('retrying')
    expect(classifySyncError({ code: 'ERR_NETWORK' })).toBe('retrying')
  })

  it('marks HTTP 409 as an explicit conflict', () => {
    expect(classifySyncError({ response: { status: 409 } })).toBe('conflict')
  })

  it('marks non-transient client errors as permanent without deleting the queue item', () => {
    expect(classifySyncError({ response: { status: 422 } })).toBe('failed_permanent')
  })

  it('uses increasing bounded retry delays', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const first = getSyncBackoffMs(1)
    const second = getSyncBackoffMs(2)
    const late = getSyncBackoffMs(20)

    expect(first).toBe(2_000)
    expect(second).toBe(4_000)
    expect(late).toBeLessThanOrEqual(5 * 60_000)
  })
})
