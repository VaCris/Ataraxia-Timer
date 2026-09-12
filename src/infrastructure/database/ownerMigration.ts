import { db, LocalTimerSession } from '@/infrastructure/database/db'
import {
  ANONYMOUS_OWNER_ID,
  LEGACY_OWNER_ID,
  getCurrentRoundStorageKey,
  getLocalOwnerId,
  getSettingsStorageId,
  getTimerSessionStorageId,
} from '@/infrastructure/database/localOwner'

const MIGRATION_MARKER_PREFIX = 'ataraxia_owner_data_migrated:'

const isClaimableOwner = (ownerId?: string) =>
  !ownerId || ownerId === LEGACY_OWNER_ID || ownerId === ANONYMOUS_OWNER_ID

/**
 * Claims pre-owner/guest data for the first known authenticated local profile.
 * Once claimed, records are never reassigned when another account uses the same
 * browser profile, which prevents accidental cross-account reads or sync.
 */
export const ensureCurrentOwnerData = async (): Promise<string> => {
  const ownerId = getLocalOwnerId()
  if (ownerId === ANONYMOUS_OWNER_ID) return ownerId

  const markerKey = `${MIGRATION_MARKER_PREFIX}${ownerId}`
  if (localStorage.getItem(markerKey) === '1') return ownerId

  await db.transaction('rw', db.settings, db.tasks, db.tags, db.syncQueue, db.timerSessions, async () => {
    await db.tasks
      .filter((item) => isClaimableOwner(item.ownerId))
      .modify({ ownerId })

    await db.tags
      .filter((item) => isClaimableOwner(item.ownerId))
      .modify({ ownerId })

    await db.syncQueue
      .filter((item) => isClaimableOwner(item.ownerId))
      .modify({ ownerId })

    const legacySettings = await db.settings
      .filter((item) => isClaimableOwner(item.ownerId))
      .toArray()

    for (const setting of legacySettings) {
      const remoteId = setting.remoteId || setting.id.split(':').at(-1) || 'me'
      const targetId = getSettingsStorageId(remoteId, ownerId)
      const existingTarget = await db.settings.get(targetId)

      if (!existingTarget) {
        await db.settings.put({
          ...setting,
          id: targetId,
          ownerId,
          remoteId,
        })
      }

      if (setting.id !== targetId) await db.settings.delete(setting.id)
    }

    const legacySessions = await db.timerSessions
      .filter((item) => isClaimableOwner(item.ownerId))
      .toArray()

    if (legacySessions.length) {
      const targetId = getTimerSessionStorageId(ownerId)
      const existingTarget = await db.timerSessions.get(targetId)
      const latestLegacy = [...legacySessions]
        .sort((a, b) => b.lastUpdatedAt - a.lastUpdatedAt)[0]

      if (!existingTarget && latestLegacy) {
        const migrated: LocalTimerSession = {
          ...latestLegacy,
          id: targetId,
          ownerId,
        }
        await db.timerSessions.put(migrated)
      }

      const legacyIds = legacySessions
        .map((item) => item.id)
        .filter((id) => id !== targetId)
      if (legacyIds.length) await db.timerSessions.bulkDelete(legacyIds)
    }
  })

  const ownerRoundKey = getCurrentRoundStorageKey(ownerId)
  if (!localStorage.getItem(ownerRoundKey)) {
    const legacyRound = localStorage.getItem('ataraxia_currentRound')
      || localStorage.getItem(getCurrentRoundStorageKey(ANONYMOUS_OWNER_ID))
    if (legacyRound) localStorage.setItem(ownerRoundKey, legacyRound)
  }

  localStorage.setItem(markerKey, '1')
  return ownerId
}
