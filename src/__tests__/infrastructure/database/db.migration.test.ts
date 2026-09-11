import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { AppDB, LocalTimerSession } from '@/infrastructure/database/db'

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
  it('preserves the v4 timer session and removes the legacy store after upgrading', async () => {
    const dbName = `AtaraxiaMigration-${crypto.randomUUID()}`
    openedDatabases.add(dbName)

    const legacyDb = new Dexie(dbName)
    legacyDb.version(4).stores(legacySchemaV4)
    await legacyDb.open()

    const legacySession: LocalTimerSession = {
      id: 'current_session',
      mode: 'FOCUS',
      timeLeft: 913,
      initialTime: 1500,
      isActive: true,
      isPaused: false,
      currentRound: 3,
      lastUpdatedAt: 1_725_000_000_000,
    }

    await legacyDb.table<LocalTimerSession, string>('timerSession').put(legacySession)
    legacyDb.close()

    const migratedDb = new AppDB(dbName)
    await migratedDb.open()

    expect(await migratedDb.timerSessions.get('current_session')).toEqual(legacySession)
    expect(migratedDb.tables.map((table) => table.name)).not.toContain('timerSession')
    expect(migratedDb.tables.map((table) => table.name)).toContain('timerSessions')

    const taskIndexes = migratedDb.tasks.schema.indexes.map((index) => index.name)
    expect(taskIndexes).toEqual(expect.arrayContaining([
      'userId',
      'syncStatus',
      'updatedAt',
      'createdAt',
      'deletedAt',
    ]))

    const queueIndexes = migratedDb.syncQueue.schema.indexes.map((index) => index.name)
    expect(queueIndexes).toEqual(expect.arrayContaining([
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
