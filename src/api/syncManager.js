import api from './client';
import toast from 'react-hot-toast';

export const addToSyncQueue = (request) => {
    const queue = JSON.parse(localStorage.getItem('ataraxia-sync-queue')) || [];
    queue.push(request);
    localStorage.setItem('ataraxia-sync-queue', JSON.stringify(queue));
};

export const processSyncQueue = async () => {
    const queue = JSON.parse(localStorage.getItem('ataraxia-sync-queue')) || [];
    if (queue.length === 0) return;

    toast.loading("Synchronizing offline data...", { id: 'sync' });
    const failed = [];

    for (const req of queue) {
        try {
            await api.request({
                method: req.method,
                url: req.url,
                data: req.data
            });
        } catch (error) {
            if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
                failed.push(req);
            }
        }
    }
    localStorage.setItem('ataraxia-sync-queue', JSON.stringify(failed));
    
    if (failed.length === 0) {
        toast.success("Synchronization completed", { id: 'sync' });
    }
};