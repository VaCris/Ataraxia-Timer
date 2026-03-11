import { useState, useEffect } from 'react'
import { settingsService } from '@api/settings/settings.service'
import toast from 'react-hot-toast'

export const useSettings = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await settingsService.get()
                setSettings(data)
            } catch {
                toast.error('Error obtaining configuration')
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const updateSettings = async (newConfig) => {
        try {
            const updated = await settingsService.update(newConfig)

            setSettings(updated)

            toast.success('Saved settings successfully')
        } catch {
            toast.error('Error saving changes to settings')
        }
    }

    return { settings, loading, updateSettings }
}