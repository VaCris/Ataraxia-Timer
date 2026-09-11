import type { AuthUser } from '@/features/auth/types/auth.dto'

const LOCAL_PROFILE_KEY = 'ataraxia_local_profile'

export const authLocalRepository = {
  getProfile(): AuthUser | null {
    try {
      const raw = localStorage.getItem(LOCAL_PROFILE_KEY)
      if (!raw) return null

      const profile = JSON.parse(raw) as AuthUser
      if (!profile?.id || !profile?.name) return null

      return profile
    } catch {
      return null
    }
  },

  saveProfile(user: AuthUser): void {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(user))
  },

  clearProfile(): void {
    localStorage.removeItem(LOCAL_PROFILE_KEY)
  },
}
