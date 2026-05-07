import { useState, useCallback, useEffect } from 'react';

interface UsePipControllerReturn {
    pipWindow: Window | null;
    togglePip: () => Promise<void>;
}

export const usePipController = (): UsePipControllerReturn => {
    const [pipWindow, setPipWindow] = useState<Window | null>(null);

    const togglePip = useCallback(async () => {
        if (!window.documentPictureInPicture) {
            console.warn('PIP not supported');
            return;
        }

        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
            return;
        }

        try {
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 400,
                height: 350
            });

            const style = pip.document.createElement('style');
            style.textContent = 'body { margin: 0; padding: 0; background: #050505; overflow: hidden; }';
            pip.document.head.appendChild(style);

            pip.addEventListener('pagehide', () => {
                setPipWindow(null);
            });

            setPipWindow(pip);
        } catch (error) {
            setPipWindow(null);
        }
    }, [pipWindow]);

    useEffect(() => {
        const handleUnload = () => {
            if (pipWindow) {
                pipWindow.close();
            }
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [pipWindow]);

    return { pipWindow, togglePip };
};