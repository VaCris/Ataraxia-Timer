import { useState, useEffect } from 'react';

let capturedPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    capturedPrompt = event;
});

export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(capturedPrompt);
    const [isInstallable, setIsInstallable] = useState(!!capturedPrompt);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            capturedPrompt = event;
            setDeferredPrompt(event);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            capturedPrompt = null;
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        const promptToUse = deferredPrompt || capturedPrompt;

        if (!promptToUse) {
            alert("The browser hasn't triggered the install event yet. Make sure you are not in Incognito mode.");
            return 'unavailable';
        }

        await promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;

        if (outcome === 'accepted') {
            capturedPrompt = null;
            setDeferredPrompt(null);
            setIsInstallable(false);
        }

        return outcome;
    };

    return { isInstallable, handleInstallClick, setIsInstallable };
};