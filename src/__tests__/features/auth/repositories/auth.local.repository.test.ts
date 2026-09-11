import { beforeEach, describe, expect, it } from 'vitest'
import { authLocalRepository } from '@/features/auth/repositories/auth.local.repository'
import type { AuthUser } from '@/features/auth/types/auth.dto'

const user: AuthUser = {
  id: 'user-1',
  name: 'Offline User',
  email: 'offline@example.com',
  isGuest: false,
}

describe('authLocalRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists and restores a known profile', () => {
    authLocalRepository.saveProfile(user)

    expect(authLocalRepository.getProfile()).toEqual(user)
  })

  it('clears the local profile on explicit logout cleanup', () => {
    authLocalRepository.saveProfile(user)
    authLocalRepository.clearProfile()

    expect(authLocalRepository.getProfile()).toBeNull()
  })

  it('ignores malformed or incomplete persisted profiles', () => {
    localStorage.setItem('ataraxia_local_profile', '{invalid-json')
    expect(authLocalRepository.getProfile()).toBeNull()

    localStorage.setItem('ataraxia_local_profile', JSON.stringify({ id: 'user-1' }))
    expect(authLocalRepository.getProfile()).toBeNull()
  })
})
