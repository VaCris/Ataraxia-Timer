const ALLOWED_URL_SCHEMES = ['https:', 'http:']
const ALLOWED_IMAGE_SCHEMES = ['https:', 'data:']

export function sanitizeUrl(url: string, allowedSchemes: string[] = ALLOWED_URL_SCHEMES): string {
  const trimmed = url.trim()
  if (!trimmed) return ''

  try {
    const parsed = new URL(trimmed)
    if (!allowedSchemes.includes(parsed.protocol)) {
      return ''
    }
    return trimmed
  } catch {
    return ''
  }
}

export function sanitizeImageUrl(url: string): string {
  const sanitized = sanitizeUrl(url, ALLOWED_IMAGE_SCHEMES)
  if (!sanitized) return ''

  if (sanitized.startsWith('data:') && !/^data:image\/[a-z0-9.+-]+;base64,/i.test(sanitized)) {
    return ''
  }

  return sanitized
}

export function sanitizeForCss(value: string): string {
  return value
    .replace(/\\/g, '')
    .replace(/"/g, '')
    .replace(/'/g, '')
    .replace(/[()]/g, '')
}

export function sanitizeInput(value: string): string {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
