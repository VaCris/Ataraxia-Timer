import Dexie, { Table } from "dexie"
import { SettingModel } from "@/features/settings/types/setting.model"
import { TaskResponse } from "@/features/tasks/types/task.dto"
import { Mode } from "@/features/pomodoro/store/timerSlice"
import { TagResponse } from "@/features/tags/types/tag.dto"
import { LEGACY_OWNER_ID, getSettingsStorageId } from "@/infrastructure/database/localOwner"

export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'
export type SyncQueueStatus = 'pending' | 'retrying' | 'blocked_auth' | 'conflict' | 'failed_permanent'

export type LocalTaskModel = TaskResponse & {
    ownerId: string
    userId?: string
    createdAt?: string
    syncStatus: SyncStatus
    updatedAt: number
    deletedAt?: number | null
}

export type SyncQueueItem = {
    id: string
    ownerId: string
    method: 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    data?: unknown
    entity?: 'tasks' | 'settings' | 'timer' | 'tags'
    entityId?: string
    retries: number
    ts: number
    status: SyncQueueStatus
    lastError?: string
    nextRetryAt?: number
}

export type LocalTagModel = TagResponse & {
    ownerId: string
    syncStatus: SyncStatus
    updatedAt: number
    deletedAt?: number | null
}

export interface LocalTimerSession {
    id: string
    ownerId: string
    mode: Mode
    timeLeft: number
    initialTime: number
    isActive: boolean
    isPaused: boolean
    currentRound: number
    lastUpdatedAt: number
}

/**
 * IndexedDB migration policy:
 * - Every schema change must create a new Dexie version.
 * - Data/store renames must be migrated in an upgrade callback before the old store is removed.
 * - Destructive store/index changes must be covered by a migration regression test.
 */
export class AppDB extends Dexie {
    settings!: Table<SettingModel, string>
    tasks!: Table<LocalTaskModel, string>
    syncQueue!: Table<SyncQueueItem, string>
    timerSessions!: Table<LocalTimerSession, string>
    tags!: Table<LocalTagModel, string>

    constructor(dbName = "AtaraxiaDB") {
        super(dbName)

        this.version(1).stores({
            settings: "id, userId, syncStatus, updatedAt"
        })

        this.version(2).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, entity, entityId, method, url, retries, ts"
        })

        this.version(3).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, [entity+entityId], entity, entityId, method, url, retries, ts"
        })

        this.version(4).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, [entity+entityId], entity, entityId, method, url, retries, ts",
            timerSession: "id"
        })

        // v5 is intentionally a bridge version: keep the legacy store long enough
        // to copy its data into the pluralized store before removing it in v6.
        this.version(5).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, [entity+entityId], entity, entityId, method, url, retries, ts",
            timerSession: "id",
            timerSessions: "id",
            tags: "id, syncStatus, updatedAt, deletedAt"
        }).upgrade(async (tx) => {
            const legacySessions = await tx.table<LocalTimerSession, string>('timerSession').toArray()
            if (legacySessions.length) {
                await tx.table<LocalTimerSession, string>('timerSessions').bulkPut(legacySessions)
            }
        })

        this.version(6).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, [entity+entityId], entity, entityId, method, status, nextRetryAt, retries, ts",
            timerSession: null,
            timerSessions: "id",
            tags: "id, syncStatus, updatedAt, deletedAt"
        }).upgrade(async (tx) => {
            const queue = tx.table('syncQueue')
            await queue.toCollection().modify((item: SyncQueueItem) => {
                item.status = item.status || 'pending'
            })
        })

        // v7 introduces ownership boundaries for core local data. Legacy records
        // are tagged first and claimed lazily by the known local profile.
        this.version(7).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, ownerId, [ownerId+syncStatus], userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, ownerId, [entity+entityId], entity, entityId, method, status, nextRetryAt, retries, ts",
            timerSessions: "id, ownerId",
            tags: "id, ownerId, [ownerId+syncStatus], syncStatus, updatedAt, deletedAt"
        }).upgrade(async (tx) => {
            await tx.table('tasks').toCollection().modify((item: LocalTaskModel) => {
                item.ownerId = item.ownerId || LEGACY_OWNER_ID
            })
            await tx.table('tags').toCollection().modify((item: LocalTagModel) => {
                item.ownerId = item.ownerId || LEGACY_OWNER_ID
            })
            await tx.table('syncQueue').toCollection().modify((item: SyncQueueItem) => {
                item.ownerId = item.ownerId || LEGACY_OWNER_ID
                item.status = item.status || 'pending'
            })
            await tx.table('timerSessions').toCollection().modify((item: LocalTimerSession) => {
                item.ownerId = item.ownerId || LEGACY_OWNER_ID
            })
        })

        // v8 namespaces settings records while preserving the remote identifier
        // (`me`) separately from the IndexedDB primary key.
        this.version(8).stores({
            settings: "id, ownerId, [ownerId+remoteId], remoteId, syncStatus, updatedAt",
            tasks: "id, ownerId, [ownerId+syncStatus], userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, ownerId, [entity+entityId], entity, entityId, method, status, nextRetryAt, retries, ts",
            timerSessions: "id, ownerId",
            tags: "id, ownerId, [ownerId+syncStatus], syncStatus, updatedAt, deletedAt"
        }).upgrade(async (tx) => {
            const settingsTable = tx.table<SettingModel, string>('settings')
            const existing = await settingsTable.toArray()

            for (const setting of existing) {
                const ownerId = setting.ownerId || LEGACY_OWNER_ID
                const remoteId = setting.remoteId || setting.id || 'me'
                const storageId = getSettingsStorageId(remoteId, ownerId)
                const migrated: SettingModel = {
                    ...setting,
                    id: storageId,
                    ownerId,
                    remoteId,
                }

                await settingsTable.put(migrated)
                if (setting.id !== storageId) await settingsTable.delete(setting.id)
            }
        })
    }
}

export const db = new AppDB()
