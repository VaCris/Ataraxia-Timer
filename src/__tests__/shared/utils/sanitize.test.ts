import { describe, expect, it } from 'vitest'
import { sanitizeForCss, sanitizeImageUrl } from '@/shared/utils/sanitize'

describe('background image sanitization', () => {
  it('preserves the separator in image data URLs so uploaded backgrounds remain valid', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB'

    expect(sanitizeForCss(dataUrl)).toBe(dataUrl)
    expect(sanitizeImageUrl(dataUrl)).toBe(dataUrl)
  })

  it('rejects non-image data URLs', () => {
    expect(sanitizeImageUrl('data:text/html;base64,PGgxPk5PUEU8L2gxPg==')).toBe('')
  })

  it('rejects script schemes for image URLs', () => {
    expect(sanitizeImageUrl('javascript:alert(1)')).toBe('')
  })
})
