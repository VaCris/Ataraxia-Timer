import { useEffect } from 'react'
import {
    applyAccentColor,
    applyBgImage,
    applyBlur,
} from '@/shared/utils/theme'

export const useThemeEffect = (
    accentColor: string,
    bgImage: string | null,
    blur: number
) => {
    useEffect(() => {
        applyAccentColor(accentColor)
        applyBgImage(bgImage ?? '')
        applyBlur(blur)
    }, [accentColor, bgImage, blur])
}