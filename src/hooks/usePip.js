import { useState, useCallback, useRef } from 'react';

export const usePip = () => {
    const pipWindowRef = useRef(null);
    const [pipContainer, setPipContainer] = useState(null);

    const togglePip = useCallback(async () => {
        if (pipContainer && pipWindowRef.current) {
            pipWindowRef.current.close();
            return;
        }

        try {
            const pip = await window.documentPictureInPicture.requestWindow({
                width: 400,
                height: 450,
            });

            // Copiar estilos para que se vea el diseño (Tailwind/CSS)
            [...document.styleSheets].forEach((styleSheet) => {
                try {
                    const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
                    const style = pip.document.createElement('style');
                    style.textContent = cssRules;
                    pip.document.head.appendChild(style);
                } catch (e) {
                    const link = pip.document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = styleSheet.href;
                    pip.document.head.appendChild(link);
                }
            });

            pip.addEventListener("pagehide", () => {
                pipWindowRef.current = null;
                setPipContainer(null);
            });

            pipWindowRef.current = pip;
            setPipContainer(pip.document.body);
        } catch (error) {
            console.error("PiP failed:", error);
        }
    }, [pipContainer]);

    return { pipContainer, togglePip };
};