export * from './setting.dto'
export * from './setting.model'

export interface UISettings {
    theme: 'light' | 'dark' | 'system'
    accentColor: string
    bgImage: string | null
    blurIntensity: number
    volume: number
    isMuted: boolean
    pipEnabled: boolean
    is24Hour: boolean
    customShortcuts: Record<string, string>
}