const LOCAL_PROFILE_KEY = 'ataraxia_local_profile'

export const LEGACY_OWNER_ID = 'legacy-local'
export const ANONYMOUS_OWNER_ID = 'local-anonymous'

export const getLocalOwnerId = (): string => {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY)
    if (!raw) return ANONYMOUS_OWNER_ID

    const profile = JSON.parse(raw) as { id?: string | number }
    if (profile?.id === undefined || profile?.id === null || profile.id === '') {
      return ANONYMOUS_OWNER_ID
    }

    return `user:${String(profile.id)}`
  } catch {
    return ANONYMOUS_OWNER_ID
  }
}
