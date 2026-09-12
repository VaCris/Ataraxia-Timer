import { db } from "@/infrastructure/database/db"
import { ensureCurrentOwnerData } from "@/infrastructure/database/ownerMigration"
import { getSettingsStorageId } from "@/infrastructure/database/localOwner"
import { SettingModel } from "../types/setting.model"

const toPublicSetting = (setting: SettingModel): SettingModel => {
    const remoteId = setting.remoteId || setting.id.split(':').at(-1) || 'me'
    const {
        ownerId: _ownerId,
        remoteId: _remoteId,
        ...rest
    } = setting

    return {
        ...rest,
        id: remoteId,
    }
}

export const settingsLocalRepository = {
    async get(): Promise<SettingModel | null> {
        const ownerId = await ensureCurrentOwnerData()
        const setting = await db.settings
            .where('ownerId')
            .equals(ownerId)
            .first()

        return setting ? toPublicSetting(setting) : null
    },

    async save(setting: SettingModel): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        const remoteId = setting.remoteId || setting.id || 'me'

        await db.settings.put({
            ...setting,
            id: getSettingsStorageId(remoteId, ownerId),
            ownerId,
            remoteId,
            syncStatus: 'synced',
            updatedAt: Date.now()
        })
    },

    async update(partial: Partial<SettingModel>): Promise<SettingModel> {
        const ownerId = await ensureCurrentOwnerData()
        const current = await db.settings
            .where('ownerId')
            .equals(ownerId)
            .first()

        if (!current) {
            throw new Error("Settings not initialized")
        }

        const remoteId = current.remoteId || current.id.split(':').at(-1) || 'me'
        const updated: SettingModel = {
            ...current,
            ...partial,
            id: getSettingsStorageId(remoteId, ownerId),
            ownerId,
            remoteId,
            syncStatus: 'pending_update',
            updatedAt: Date.now()
        }

        await db.settings.put(updated)

        return toPublicSetting(updated)
    },

    async markAsSynced(id: string): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        const storageId = getSettingsStorageId(id || 'me', ownerId)
        const setting = await db.settings.get(storageId)
        if (!setting || setting.ownerId !== ownerId) return

        await db.settings.put({
            ...setting,
            syncStatus: 'synced'
        })
    },

    async getPending(): Promise<SettingModel[]> {
        const ownerId = await ensureCurrentOwnerData()
        const pending = await db.settings
            .where('ownerId')
            .equals(ownerId)
            .filter((setting) => setting.syncStatus !== 'synced')
            .toArray()

        return pending.map(toPublicSetting)
    },

    async clear(): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        await db.settings.where('ownerId').equals(ownerId).delete()
    }
}
