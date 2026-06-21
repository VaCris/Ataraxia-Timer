import { db } from "@/infrastructure/database/db"
import { SettingModel } from "../types/setting.model"

export const settingsLocalRepository = {
    async get(): Promise<SettingModel | null> {
        const all = await db.settings.toArray()
        return all[0] ?? null
    },

    async save(setting: SettingModel): Promise<void> {
        await db.settings.put({
            ...setting,
            syncStatus: 'synced',
            updatedAt: Date.now()
        })
    },

    async update(partial: Partial<SettingModel>): Promise<SettingModel> {
        const current = await this.get()

        if (!current) {
            throw new Error("Settings not initialized")
        }

        const updated: SettingModel = {
            ...current,
            ...partial,
            syncStatus: 'pending_update',
            updatedAt: Date.now()
        }

        await db.settings.put(updated)

        return updated
    },

    async markAsSynced(id: string): Promise<void> {
        const setting = await db.settings.get(id)
        if (!setting) return

        await db.settings.put({
            ...setting,
            syncStatus: 'synced'
        })
    },

    async getPending(): Promise<SettingModel[]> {
        return db.settings
            .where("syncStatus")
            .notEqual("synced")
            .toArray()
    },

    async clear(): Promise<void> {
        await db.settings.clear()
    }
}