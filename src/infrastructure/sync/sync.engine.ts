import { settingsLocalRepository } from "@/features/settings/repositories/settings.local.repository"
import { settingsRemoteRepository } from "@/features/settings/repositories/settings.remote.repository"

class SyncEngine {
    private isRunning = false

    async run() {
        if (this.isRunning) return
        this.isRunning = true

        try {
            await this.syncSettings()
            // futuro:
            // await this.syncTasks()
            // await this.syncTags()
        } finally {
            this.isRunning = false
        }
    }
}

export const syncEngine = new SyncEngine()