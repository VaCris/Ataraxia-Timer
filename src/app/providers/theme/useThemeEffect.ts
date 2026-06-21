import { useEffect, useLayoutEffect } from 'react'
import {
    applyAccentColor,
    applyBgImage,
    applyBlur,
} from '@/shared/utils/theme'

export const useThemeEffect = (
    accentColor: string,
    bgImage: string | null,
    blur: number,
    theme: string
) => {
    useLayoutEffect(() => {
        applyAccentColor(accentColor)
        applyBgImage(bgImage ?? '')
        applyBlur(blur)
    }, [accentColor, bgImage, blur])

    useLayoutEffect(() => {
        const root = document.documentElement;
        
        const updateTheme = (themeValue: string) => {
            root.classList.remove('theme-light', 'theme-dark');
            
            if (themeValue === 'light') {
                root.classList.add('theme-light');
            } else if (themeValue === 'dark') {
                root.classList.add('theme-dark');
            } else if (themeValue === 'system') {
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.classList.add(systemDark ? 'theme-dark' : 'theme-light');
            }
        };

        updateTheme(theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                updateTheme('system');
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);
}