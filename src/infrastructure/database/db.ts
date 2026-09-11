import Dexie, { Table } from "dexie"
import { SettingModel } from "@/features/settings/types/setting.model"
import { TaskResponse } from "@/features/tasks/types/task.dto"
import { Mode } from "@/features/pomodoro/store/timerSlice"
import { TagResponse } from "@/features/tags/types/tag.dto"

export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'
export type SyncQueueStatus = 'pending' | 'retrying' | 'blocked_auth' | 'conflict' | 'failed_permanent'

export type LocalTaskModel = TaskResponse & {
    syncStatus: SyncStatus
    updatedAt: number
    deletedAt?: number | null
}

export type SyncQueueItem = {
    id: string
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
    syncStatus: SyncStatus
    updatedAt: number
    deletedAt?: number | null
}

export interface LocalTimerSession {
    id: string
    mode: Mode
    timeLeft: number
    initialTime: number
    isActive: boolean
    isPaused: boolean
    currentRound: number
    lastUpdatedAt: number
}

export class AppDB extends Dexie {
    settings!: Table<SettingModel, string>
    tasks!: Table<LocalTaskModel, string>
    syncQueue!: Table<SyncQueueItem, string>
    timerSessions!: Table<LocalTimerSession, string>
    tags!: Table<LocalTagModel, string>

    constructor() {
        super("AtaraxiaDB")

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

        this.version(5).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, [entity+entityId], entity, entityId, method, url, retries, ts",
            timerSession: null,
            timerSessions: "id",
            tags: "id, syncStatus, updatedAt, deletedAt"
        }).upgrade(async (tx) => {
            try {
                const legacySessions = await tx.table('timerSession').toArray()
                if (legacySessions.length) {
                    await tx.table('timerSessions').bulkPut(legacySessions)
                }
            } catch {
                // Fresh installs and already-migrated databases have no legacy store.
            }
        })

        this.version(6).stores({
            settings: "id, userId, syncStatus, updatedAt",
            tasks: "id, userId, syncStatus, updatedAt, createdAt, deletedAt",
            syncQueue: "id, [entity+entityId], entity, entityId, method, status, nextRetryAt, retries, ts",
            timerSessions: "id",
            tags: "id, syncStatus, updatedAt, deletedAt"
        }).upgrade(async (tx) => {
            const queue = tx.table('syncQueue')
            await queue.toCollection().modify((item: SyncQueueItem) => {
                item.status = item.status || 'pending'
            })
        })
    }
}

export const db = new AppDB()
