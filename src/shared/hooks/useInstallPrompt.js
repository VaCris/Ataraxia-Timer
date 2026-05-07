import { useState, useEffect } from 'react';

let capturedPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    capturedPrompt = e;
});

export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(capturedPrompt);
    const [isInstallable, setIsInstallable] = useState(!!capturedPrompt);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            capturedPrompt = e;
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        
        window.addEventListener('appinstalled', () => {
            capturedPrompt = null;
            setIsInstallable(false);
            setDeferredPrompt(null);
        });

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        const promptToUse = deferredPrompt || capturedPrompt;

        if (!promptToUse) {
            alert("The browser hasn't triggered the install event yet. Make sure you are not in Incognito mode.");
            return;
        }

        promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;
        
        if (outcome === 'accepted') {
            capturedPrompt = null;
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return { isInstallable, handleInstallClick, setIsInstallable };
};