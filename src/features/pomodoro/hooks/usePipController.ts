import { useCallback, useEffect, useRef, useState } from 'react';

type DocumentPictureInPictureApi = {
    window?: Window | null;
    requestWindow: (options?: { width?: number; height?: number }) => Promise<Window>;
};

type WindowWithDocumentPictureInPicture = Window & {
    documentPictureInPicture?: DocumentPictureInPictureApi;
};

interface UsePipControllerReturn {
    pipWindow: Window | null;
    isPipSupported: boolean;
    isPipOpen: boolean;
    pipError: string | null;
    togglePip: () => Promise<void>;
    closePip: () => void;
}

const getDocumentPictureInPicture = () => {
    if (typeof window === 'undefined') return null;

    return (window as WindowWithDocumentPictureInPicture).documentPictureInPicture || null;
};

const preparePipWindow = (pip: Window) => {
    pip.document.title = 'Ataraxia Timer';
    pip.document.documentElement.style.background = '#050505';
    pip.document.documentElement.style.overflow = 'hidden';
    pip.document.body.style.margin = '0';
    pip.document.body.style.padding = '0';
    pip.document.body.style.width = '100vw';
    pip.document.body.style.height = '100vh';
    pip.document.body.style.background = '#050505';
    pip.document.body.style.overflow = 'hidden';

    const viewport = pip.document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    pip.document.head.appendChild(viewport);
};

export const usePipController = (): UsePipControllerReturn => {
    const pipWindowRef = useRef<Window | null>(null);
    const [pipWindow, setPipWindow] = useState<Window | null>(null);
    const [pipError, setPipError] = useState<string | null>(null);

    const isPipSupported = Boolean(getDocumentPictureInPicture());
    const isPipOpen = Boolean(pipWindow && !pipWindow.closed);

    const closePip = useCallback(() => {
        const currentWindow = pipWindowRef.current;

        if (currentWindow && !currentWindow.closed) {
            currentWindow.close();
        }

        pipWindowRef.current = null;
        setPipWindow(null);
    }, []);

    const togglePip = useCallback(async () => {
        const documentPictureInPicture = getDocumentPictureInPicture();

        if (!documentPictureInPicture) {
            setPipError('Picture-in-Picture is not supported in this browser.');
            return;
        }

        const currentWindow = pipWindowRef.current;

        if (currentWindow && !currentWindow.closed) {
            closePip();
            return;
        }

        try {
            setPipError(null);

            const pip = await documentPictureInPicture.requestWindow({
                width: 420,
                height: 430,
            });

            preparePipWindow(pip);

            pip.addEventListener(
                'pagehide',
                () => {
                    pipWindowRef.current = null;
                    setPipWindow(null);
                },
                { once: true }
            );

            pipWindowRef.current = pip;
            setPipWindow(pip);
        } catch (error) {
            pipWindowRef.current = null;
            setPipWindow(null);

            const message =
                error instanceof Error
                    ? error.message
                    : 'Could not open Picture-in-Picture window.';

            setPipError(message);
            console.error('Document Picture-in-Picture failed:', error);
        }
    }, [closePip]);

    useEffect(() => {
        return () => {
            const currentWindow = pipWindowRef.current;

            if (currentWindow && !currentWindow.closed) {
                currentWindow.close();
            }
        };
    }, []);

    return {
        pipWindow,
        isPipSupported,
        isPipOpen,
        pipError,
        togglePip,
        closePip,
    };
};
