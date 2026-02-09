import { tasksService } from './tasks.service';
import { timersService } from './timers.service';
import { settingsService } from './settings.service';

let isSyncingActive = false;

export const syncManager = {
    async syncAll() {
        if (isSyncingActive || !navigator.onLine) return;
        isSyncingActive = true;
        try {
            if (this.getQueue('outbox_tasks').length > 0) await this.syncTasks();
            if (this.getQueue('outbox_timers').length > 0) await this.syncTimers();
            await this.syncSettings();
        } finally {
            isSyncingActive = false;
        }
    },

    async syncTasks() {
        const queue = this.getQueue('outbox_tasks');
        for (const task of [...queue]) {
            if (!navigator.onLine) break;
            try {
                await tasksService.create({ title: task.title, tag: task.tag }, true);
                this.removeFromQueue('outbox_tasks', task.tempId);
            } catch (err: any) {
                if (!err.response) break;
                this.removeFromQueue('outbox_tasks', task.tempId);
            }
        }
    },

    async syncTimers() {
        const queue = this.getQueue('outbox_timers');
        for (const session of [...queue]) {
            if (!navigator.onLine) break;
            try {
                await timersService.saveSession(session, true);
                this.removeFromQueue('outbox_timers', session.tempId);
            } catch (err: any) {
                if (!err.response) break;
                this.removeFromQueue('outbox_timers', session.tempId);
            }
        }
    },

    async syncSettings() {
        const queue = this.getQueue('outbox_settings');
        if (queue.length === 0) return;
        const lastSetting = queue[queue.length - 1];
        try {
            await settingsService.updateSettings(lastSetting, true);
            localStorage.removeItem('outbox_settings');
        } catch (err) { }
    },

    getQueue(key: string) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    },

    addToQueue(key: string, data: any) {
        const queue = this.getQueue(key);
        const isDuplicate = queue.some(item => JSON.stringify(item) === JSON.stringify(data));
        if (!isDuplicate) {
            localStorage.setItem(key, JSON.stringify([...queue, data]));
        }
    },

    removeFromQueue(key: string, tempId: string) {
        const queue = this.getQueue(key);
        localStorage.setItem(key, JSON.stringify(queue.filter((t: any) => t.tempId !== tempId)));
    }
};

let syncDebounce: any;
window.addEventListener('online', () => {
    clearTimeout(syncDebounce);
    syncDebounce = setTimeout(() => syncManager.syncAll(), 5000);
});