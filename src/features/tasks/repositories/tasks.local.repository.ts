import { db, LocalTaskModel } from '@/infrastructure/database/db'
import { ensureCurrentOwnerData } from '@/infrastructure/database/ownerMigration'
import { getLocalProfileId } from '@/infrastructure/database/localOwner'
import { CreateTaskDto, TaskResponse, UpdateTaskDto } from '@/features/tasks/types/task.dto'

const nowIso = () => new Date().toISOString()
const nowMs = () => Date.now()

const toTaskResponse = (task: LocalTaskModel): TaskResponse => {
    const {
        ownerId: _ownerId,
        syncStatus: _syncStatus,
        updatedAt: _updatedAt,
        deletedAt: _deletedAt,
        ...response
    } = task
    return response
}

export const tasksLocalRepository = {
    async getAll(): Promise<TaskResponse[]> {
        const ownerId = await ensureCurrentOwnerData()
        const tasks = await db.tasks
            .where('ownerId')
            .equals(ownerId)
            .filter((task) => task.syncStatus !== 'pending_delete')
            .toArray()

        return tasks
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map(toTaskResponse)
    },

    async replaceAll(tasks: TaskResponse[]): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        const pending = await db.tasks
            .where('ownerId')
            .equals(ownerId)
            .filter((task) => task.syncStatus !== 'synced')
            .toArray()

        const syncedTasks: LocalTaskModel[] = tasks.map((task) => ({
            ...task,
            ownerId,
            syncStatus: 'synced',
            updatedAt: nowMs(),
            deletedAt: null,
        }))

        await db.transaction('rw', db.tasks, async () => {
            await db.tasks.where('ownerId').equals(ownerId).delete()
            await db.tasks.bulkPut([...syncedTasks, ...pending])
        })
    },

    async create(payload: CreateTaskDto): Promise<TaskResponse> {
        const ownerId = await ensureCurrentOwnerData()
        const task: LocalTaskModel = {
            id: `local-${crypto.randomUUID()}`,
            ownerId,
            userId: getLocalProfileId() || 'local',
            title: payload.title,
            tagIds: payload.tagIds || [],
            status: 'TODO',
            createdAt: nowIso(),
            syncStatus: 'pending_create',
            updatedAt: nowMs(),
            deletedAt: null,
        }

        await db.tasks.put(task)
        return toTaskResponse(task)
    },

    async createFromRemote(task: TaskResponse): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        await db.tasks.put({
            ...task,
            ownerId,
            syncStatus: 'synced',
            updatedAt: nowMs(),
            deletedAt: null,
        })
    },

    async update(id: string, payload: UpdateTaskDto): Promise<TaskResponse> {
        const ownerId = await ensureCurrentOwnerData()
        const current = await db.tasks.get(id)

        if (!current || current.ownerId !== ownerId) {
            throw new Error('Task not found locally for the active profile')
        }

        const syncStatus = current.syncStatus === 'pending_create'
            ? 'pending_create'
            : 'pending_update'

        const updated: LocalTaskModel = {
            ...current,
            ...payload,
            ownerId,
            syncStatus,
            updatedAt: nowMs(),
        }

        await db.tasks.put(updated)
        return toTaskResponse(updated)
    },

    async updateFromRemote(task: TaskResponse): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        await db.tasks.put({
            ...task,
            ownerId,
            syncStatus: 'synced',
            updatedAt: nowMs(),
            deletedAt: null,
        })
    },

    async remove(id: string): Promise<boolean> {
        const ownerId = await ensureCurrentOwnerData()
        const current = await db.tasks.get(id)

        if (!current || current.ownerId !== ownerId) return false

        if (current.syncStatus === 'pending_create') {
            await db.tasks.delete(id)
            await db.syncQueue
                .where('[entity+entityId]')
                .equals(['tasks', id])
                .filter((item) => item.ownerId === ownerId)
                .delete()

            return false
        }

        await db.tasks.put({
            ...current,
            ownerId,
            syncStatus: 'pending_delete',
            deletedAt: nowMs(),
            updatedAt: nowMs(),
        })

        return true
    },

    async removeSynced(id: string): Promise<void> {
        const ownerId = await ensureCurrentOwnerData()
        const current = await db.tasks.get(id)
        if (current?.ownerId === ownerId) await db.tasks.delete(id)
    },
}
