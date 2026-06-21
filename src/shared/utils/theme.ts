export const applyAccentColor = (color: string) => {
    document.documentElement.style.setProperty('--color-accent', color)
    const rgb = color.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(',') || '225,29,72'
    document.documentElement.style.setProperty('--color-accent-rgb', rgb)
}

export const applyBgImage = (url: string) => {
    if (url) {
        document.documentElement.style.setProperty('--bg-image', `url("${url}")`)
    } else {
        document.documentElement.style.removeProperty('--bg-image')
    }
}

export const applyBlur = (intensity: number) => {
    const pxValue = (intensity / 100) * 40
    document.documentElement.style.setProperty('--bg-blur', `${pxValue}px`)
}