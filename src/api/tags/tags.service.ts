import api from '../Client';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

export const tagsService = {
    getAll: async () => {
        const { data } = await api.get('/tags');
        return data;
    },

    create: async (tagData: CreateTagDto) => {
        const { data } = await api.post('/tags', tagData);
        return data;
    },

    update: async (id: string, updateData: UpdateTagDto) => {
        const { data } = await api.patch(`/tags/${id}`, updateData);
        return data;
    },

    delete: async (id: string) => {
        const { data } = await api.delete(`/tags/${id}`);
        return data;
    }
};