import Dexie, { Table } from "dexie"
import { SettingModel } from "@/features/settings/types/setting.model"

export class AppDB extends Dexie {
    settings!: Table<SettingModel, string>

    constructor() {
        super("AtaraxiaDB")

        this.version(1).stores({
            settings: "id, userId, syncStatus, updatedAt"
        })
    }
}

export const db = new AppDB()