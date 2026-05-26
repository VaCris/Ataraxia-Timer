import { db, LocalTaskModel } from '@/infrastructure/database/db'
import { CreateTaskDto, TaskResponse, UpdateTaskDto } from '@/features/tasks/types/task.dto'

const LOCAL_USER_ID = 'local'

const nowIso = () => new Date().toISOString()
const nowMs = () => Date.now()

export const tasksLocalRepository = {
    async getAll(): Promise<TaskResponse[]> {
        const tasks = await db.tasks
            .where('syncStatus')
            .notEqual('pending_delete')
            .toArray()

        return tasks
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map(({ syncStatus: _syncStatus, updatedAt: _updatedAt, deletedAt: _deletedAt, ...task }) => task)
    },

    async replaceAll(tasks: TaskResponse[]): Promise<void> {
        const pending = await db.tasks
            .where('syncStatus')
            .notEqual('synced')
            .toArray()

        const syncedTasks: LocalTaskModel[] = tasks.map((task) => ({
            ...task,
            syncStatus: 'synced',
            updatedAt: nowMs(),
            deletedAt: null,
        }))

        await db.transaction('rw', db.tasks, async () => {
            await db.tasks.clear()
            await db.tasks.bulkPut([...syncedTasks, ...pending])
        })
    },

    async create(payload: CreateTaskDto): Promise<TaskResponse> {
        const task: LocalTaskModel = {
            id: crypto.randomUUID(),
            userId: LOCAL_USER_ID,
            title: payload.title,
            tag: payload.tag?.trim() || 'General',
            completed: false,
            createdAt: nowIso(),
            syncStatus: 'pending_create',
            updatedAt: nowMs(),
            deletedAt: null,
        }

        await db.tasks.put(task)

        const { syncStatus: _syncStatus, updatedAt: _updatedAt, deletedAt: _deletedAt, ...response } = task
        return response
    },

    async createFromRemote(task: TaskResponse): Promise<void> {
        await db.tasks.put({
            ...task,
            syncStatus: 'synced',
            updatedAt: nowMs(),
            deletedAt: null,
        })
    },

    async update(id: string, payload: UpdateTaskDto): Promise<TaskResponse> {
        const current = await db.tasks.get(id)

        if (!current) {
            throw new Error('Task not found locally')
        }

        const syncStatus = current.syncStatus === 'pending_create'
            ? 'pending_create'
            : 'pending_update'

        const updated: LocalTaskModel = {
            ...current,
            ...payload,
            syncStatus,
            updatedAt: nowMs(),
        }

        await db.tasks.put(updated)

        const { syncStatus: _syncStatus, updatedAt: _updatedAt, deletedAt: _deletedAt, ...response } = updated
        return response
    },

    async updateFromRemote(task: TaskResponse): Promise<void> {
        await db.tasks.put({
            ...task,
            syncStatus: 'synced',
            updatedAt: nowMs(),
            deletedAt: null,
        })
    },

    async remove(id: string): Promise<void> {
        const current = await db.tasks.get(id)

        if (!current) return

        if (current.syncStatus === 'pending_create') {
            await db.tasks.delete(id)
            return
        }

        await db.tasks.put({
            ...current,
            syncStatus: 'pending_delete',
            deletedAt: nowMs(),
            updatedAt: nowMs(),
        })
    },

    async removeSynced(id: string): Promise<void> {
        await db.tasks.delete(id)
    },
}
