import { db, LocalTagModel } from '@/infrastructure/database/db';

export const tagsLocalRepository = {
    async getAll(): Promise<LocalTagModel[]> {
        return await db.tags.filter(tag => !tag.deletedAt).toArray();
    },

    async create(tag: LocalTagModel): Promise<void> {
        await db.tags.put(tag);
    },

    async update(id: string, data: Partial<LocalTagModel>): Promise<void> {
        await db.tags.update(id, { ...data, updatedAt: Date.now() });
    },

    async delete(id: string): Promise<void> {
        await db.tags.update(id, {
            deletedAt: Date.now(),
            syncStatus: 'pending_delete'
        });
    },

    async replaceAll(tags: LocalTagModel[]): Promise<void> {
        const localOnly = await db.tags
            .filter(tag => !!tag.syncStatus && tag.syncStatus !== 'synced')
            .toArray();
        await db.tags.clear();
        for (const tag of tags) {
            await db.tags.put({ ...tag, syncStatus: 'synced' });
        }
        for (const tag of localOnly) {
            await db.tags.put(tag);
        }
    }
};