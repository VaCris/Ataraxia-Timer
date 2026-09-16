const ACCESS_TOKEN_KEY = 'token'
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken'

export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token?: string | null): void => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token)
  else localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const clearAccessToken = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export const clearLegacyRefreshToken = (): void => {
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY)
}

export const clearRemoteSession = (): void => {
  clearAccessToken()
  clearLegacyRefreshToken()
}
