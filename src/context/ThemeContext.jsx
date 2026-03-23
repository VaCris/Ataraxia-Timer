import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const hexToRgb = (hex) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '#e11d48')
    return result
        ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
        : '225 29 72'
}

const ThemeProvider = ({ children }) => {
    const settings = useSelector(s => s.settings.item || {})

    const accentColor = settings.accentColor || localStorage.getItem('ataraxia_accentColor') || '#e11d48'
    const bgImage = settings.bgImage || localStorage.getItem('ataraxia_bgImage') || ''
    const blurIntensity = settings.blurIntensity ?? Number(localStorage.getItem('ataraxia_blurIntensity')) ?? 0

    useEffect(() => {
        const root = document.documentElement

        root.style.setProperty('--color-accent', accentColor)
        root.style.setProperty('--color-accent-rgb', hexToRgb(accentColor))

        if (bgImage && bgImage.trim() !== '') {
            root.style.setProperty('--bg-image', `url("${bgImage}")`)
        } else {
            root.style.setProperty('--bg-image', 'none')
        }

        root.style.setProperty('--bg-blur', `${blurIntensity}px`)

    }, [accentColor, bgImage, blurIntensity])

    return children
}

export default ThemeProvider