import api from '../Client';
import { CreateTimerDto } from './dto/timer.dto';

export const timersService = {
    create: async (timerData: CreateTimerDto) => {
        const { data } = await api.post('/timers', timerData);
        return data;
    },

    getHistory: async () => {
        const { data } = await api.get('/timers');
        return data;
    }
};