import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { AppDB, LocalTimerSession } from '@/infrastructure/database/db'
import { LEGACY_OWNER_ID, getSettingsStorageId } from '@/infrastructure/database/localOwner'

const legacySchemaV4 = {
  settings: 'id, userId, syncStatus, updatedAt',
  tasks: 'id, userId, syncStatus, updatedAt, createdAt, deletedAt',
  syncQueue: 'id, [entity+entityId], entity, entityId, method, url, retries, ts',
  timerSession: 'id',
}

const openedDatabases = new Set<string>()

afterEach(async () => {
  for (const name of openedDatabases) {
    await Dexie.delete(name)
  }
  openedDatabases.clear()
})

describe('AppDB migrations', () => {
  it('preserves legacy core data and adds owner-aware indexes through v8', async () => {
    const dbName = `AtaraxiaMigration-${crypto.randomUUID()}`
    openedDatabases.add(dbName)

    const legacyDb = new Dexie(dbName)
    legacyDb.version(4).stores(legacySchemaV4)
    await legacyDb.open()

    const legacySession: Omit<LocalTimerSession, 'ownerId'> = {
      id: 'current_session',
      mode: 'FOCUS',
      timeLeft: 913,
      initialTime: 1500,
      isActive: true,
      isPaused: false,
      currentRound: 3,
      lastUpdatedAt: 1_725_000_000_000,
    }

    await legacyDb.table('timerSession').put(legacySession)
    await legacyDb.table('settings').put({
      id: 'me',
      pomodoroLength: 25,
      shortBreakLength: 5,
      longBreakLength: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false,
      soundEnabled: true,
      volume: 50,
      theme: 'dark',
      language: 'en',
      timeFormat: '24h',
      weekStart: 'monday',
      notificationsEnabled: true,
      syncStatus: 'synced',
      updatedAt: 100,
    })
    legacyDb.close()

    const migratedDb = new AppDB(dbName)
    await migratedDb.open()

    expect(await migratedDb.timerSessions.get('current_session')).toEqual({
      ...legacySession,
      ownerId: LEGACY_OWNER_ID,
    })
    expect(migratedDb.tables.map((table) => table.name)).not.toContain('timerSession')
    expect(migratedDb.tables.map((table) => table.name)).toContain('timerSessions')

    const migratedSettings = await migratedDb.settings.get(
      getSettingsStorageId('me', LEGACY_OWNER_ID)
    )
    expect(migratedSettings).toMatchObject({
      id: getSettingsStorageId('me', LEGACY_OWNER_ID),
      ownerId: LEGACY_OWNER_ID,
      remoteId: 'me',
      pomodoroLength: 25,
      theme: 'dark',
    })
    expect(await migratedDb.settings.get('me')).toBeUndefined()

    const taskIndexes = migratedDb.tasks.schema.indexes.map((index) => index.name)
    expect(taskIndexes).toEqual(expect.arrayContaining([
      'ownerId',
      '[ownerId+syncStatus]',
      'userId',
      'syncStatus',
      'updatedAt',
      'createdAt',
      'deletedAt',
    ]))

    const tagIndexes = migratedDb.tags.schema.indexes.map((index) => index.name)
    expect(tagIndexes).toEqual(expect.arrayContaining([
      'ownerId',
      '[ownerId+syncStatus]',
      'syncStatus',
      'updatedAt',
      'deletedAt',
    ]))

    const settingsIndexes = migratedDb.settings.schema.indexes.map((index) => index.name)
    expect(settingsIndexes).toEqual(expect.arrayContaining([
      'ownerId',
      '[ownerId+remoteId]',
      'remoteId',
      'syncStatus',
      'updatedAt',
    ]))

    const queueIndexes = migratedDb.syncQueue.schema.indexes.map((index) => index.name)
    expect(queueIndexes).toEqual(expect.arrayContaining([
      'ownerId',
      '[entity+entityId]',
      'entity',
      'entityId',
      'method',
      'status',
      'nextRetryAt',
      'retries',
      'ts',
    ]))

    migratedDb.close()
  })
})
