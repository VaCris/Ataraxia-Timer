import Dexie, { Table } from "dexie"
import { SettingModel } from "@/features/settings/types/setting.model"
import { TaskResponse } from "@/features/tasks/types/task.dto"

export type SyncStatus = 'synced' | 'pending_create' | 'pending_update' | 'pending_delete'

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
    entity?: 'tasks' | 'settings'
    entityId?: string
    retries: number
    ts: number
}

export class AppDB extends Dexie {
    settings!: Table<SettingModel, string>
    tasks!: Table<LocalTaskModel, string>
    syncQueue!: Table<SyncQueueItem, string>

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
    }
}

export const db = new AppDB()
