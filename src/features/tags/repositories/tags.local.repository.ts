import { db, LocalTagModel } from '@/infrastructure/database/db';
import { ensureCurrentOwnerData } from '@/infrastructure/database/ownerMigration';

type LocalTagInput = Omit<LocalTagModel, 'ownerId'>;

export const tagsLocalRepository = {
    async getAll(): Promise<LocalTagModel[]> {
        const ownerId = await ensureCurrentOwnerData();
        return db.tags
            .where('ownerId')
            .equals(ownerId)
            .filter((tag) => !tag.deletedAt)
            .toArray();
    },

    async create(tag: LocalTagInput): Promise<void> {
        const ownerId = await ensureCurrentOwnerData();
        await db.tags.put({ ...tag, ownerId });
    },

    async update(id: string, data: Partial<LocalTagModel>): Promise<void> {
        const ownerId = await ensureCurrentOwnerData();
        const current = await db.tags.get(id);
        if (!current || current.ownerId !== ownerId) return;

        await db.tags.update(id, {
            ...data,
            ownerId,
            updatedAt: Date.now(),
        });
    },

    async delete(id: string): Promise<boolean> {
        const ownerId = await ensureCurrentOwnerData();
        const current = await db.tags.get(id);
        if (!current || current.ownerId !== ownerId) return false;

        if (current.syncStatus === 'pending_create') {
            await db.tags.delete(id);
            await db.syncQueue
                .where('[entity+entityId]')
                .equals(['tags', id])
                .filter((item) => item.ownerId === ownerId)
                .delete();
            return false;
        }

        await db.tags.update(id, {
            ownerId,
            deletedAt: Date.now(),
            updatedAt: Date.now(),
            syncStatus: 'pending_delete',
        });
        return true;
    },

    async replaceAll(tags: LocalTagInput[]): Promise<void> {
        const ownerId = await ensureCurrentOwnerData();
        const localOnly = await db.tags
            .where('ownerId')
            .equals(ownerId)
            .filter((tag) => !!tag.syncStatus && tag.syncStatus !== 'synced')
            .toArray();

        await db.transaction('rw', db.tags, async () => {
            await db.tags.where('ownerId').equals(ownerId).delete();
            for (const tag of tags) {
                await db.tags.put({ ...tag, ownerId, syncStatus: 'synced' });
            }
            if (localOnly.length) await db.tags.bulkPut(localOnly);
        });
    }
};
