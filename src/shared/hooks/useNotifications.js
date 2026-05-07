import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useNotifications = () => {
    const [permission, setPermission] = useState(Notification.permission);
    const navigate = useNavigate();

    const requestPermission = async () => {
        if (!('Notification' in window)) return;
        const res = await Notification.requestPermission();
        setPermission(res);
        if (res === 'granted') toast.success("System Linked");
    };

    const sendUpdateNotification = async (title, lines, targetUrl = '/') => {
        if (permission !== 'granted') return;

        const formattedBody = lines.map(line => `• ${line}`).join('\n');

        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            
            registration.showNotification(title, {
                body: formattedBody,
                icon: '/pwa-192x192.png',
                badge: '/pwa-192x192.png',
                tag: 'ataraxia-version-update',
                renotify: true,
                data: { url: targetUrl },
                vibrate: [100, 50, 100],
            });
        }
    };

    return { permission, requestPermission, sendUpdateNotification };
};