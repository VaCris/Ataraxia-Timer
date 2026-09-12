const LOCAL_PROFILE_KEY = 'ataraxia_local_profile'

export const LEGACY_OWNER_ID = 'legacy-local'
export const ANONYMOUS_OWNER_ID = 'local-anonymous'

export const getLocalProfileId = (): string | null => {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY)
    if (!raw) return null

    const profile = JSON.parse(raw) as { id?: string | number }
    if (profile?.id === undefined || profile?.id === null || profile.id === '') {
      return null
    }

    return String(profile.id)
  } catch {
    return null
  }
}

export const getLocalOwnerId = (): string => {
  const profileId = getLocalProfileId()
  return profileId ? `user:${profileId}` : ANONYMOUS_OWNER_ID
}

export const getTimerSessionStorageId = (ownerId = getLocalOwnerId()): string =>
  `current_session:${ownerId}`

export const getCurrentRoundStorageKey = (ownerId = getLocalOwnerId()): string =>
  `ataraxia_currentRound:${ownerId}`

export const getSyncCursorStorageKey = (ownerId = getLocalOwnerId()): string =>
  `ataraxia_lastSyncCursor:${ownerId}`
