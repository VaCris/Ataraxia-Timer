export const applyAccentColor = (color: string) => {
    document.documentElement.style.setProperty('--color-accent', color)
    const rgb = color.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(',') || '225,29,72'
    document.documentElement.style.setProperty('--color-accent-rgb', rgb)
}

export const applyBgImage = (url: string) => {
    document.body.style.backgroundImage = url ? `url(${url})` : 'none'
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
}