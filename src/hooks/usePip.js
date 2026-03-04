import { useState, useCallback, useEffect } from 'react';

export const usePip = () => {
    const [pipWindow, setPipWindow] = useState(null);

    const togglePip = useCallback(async () => {
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
            return;
        }

        try {
            // Abrir la ventana Picture-in-Picture
            const dw = await window.documentPictureInPicture.requestWindow({
                width: 300,
                height: 350,
            });

            // Copiar estilos al nuevo documento para que Tailwind funcione
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    dw.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSheet.href;
                    dw.document.head.appendChild(link);
                }
            });

            dw.addEventListener('pagehide', () => setPipWindow(null));
            setPipWindow(dw);
        } catch (err) {
            console.error('PiP no soportado o error:', err);
        }
    }, [pipWindow]);

    return { isPipActive: !!pipWindow, pipWindow, togglePip };
};