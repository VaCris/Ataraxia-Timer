import api from '@api/Client';
import { UpdateSettingDto } from './dto/settings.dto';

export const settingsService = {
    getSettings: async () => {
        const { data } = await api.get('/settings');
        return data;
    },

    updateSettings: async (updateData: UpdateSettingDto) => {
        const { data } = await api.patch('/settings', updateData);
        return data;
    }
};