class SyncEngine {
    private isRunning = false

    async run() {
        if (this.isRunning) return
        this.isRunning = true

        try {
            // futuro: implementar sync individual por entidad
            // await this.syncSettings()
            // await this.syncTasks()
            // await this.syncTags()
        } finally {
            this.isRunning = false
        }
    }
}

export const syncEngine = new SyncEngine()
