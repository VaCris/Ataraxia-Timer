import { useState, useCallback } from 'react';

export const usePip = () => {
    const [pipWindow, setPipWindow] = useState(null);

    const togglePip = useCallback(async () => {
        if (pipWindow) {
            pipWindow.close();
            setPipWindow(null);
            return;
        }

        if (!window.documentPictureInPicture) {
            return alert("Your browser does not support floating mode");
        }

        try {
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 340,
                height: 480,
            });

            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                    const style = document.createElement('style');
                    style.textContent = cssRules;
                    pip.document.head.appendChild(style);
                } catch (e) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSheet.href;
                    pip.document.head.appendChild(link);
                }
            });

            Object.assign(pip.document.body.style, {
                backgroundColor: '#050505',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0'
            });

            pip.addEventListener('pagehide', () => setPipWindow(null));

            setPipWindow(pip);

        } catch (error) {
            console.error({ error:"Error opening PiP" });
        }
    }, [pipWindow]);

    return { pipWindow, togglePip };
};