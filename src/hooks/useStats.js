import { useState, useEffect, useCallback } from 'react'
//import { gamificationService } from '@api/gamification/gamification.service'

export const useStats = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)

    // const loadData = useCallback(async () => {
    //     try {
    //         setLoading(true)

    //         //const data = await gamificationService.getStats()

    //         setStats(data)
    //     } catch (error) {
    //         console.error('Error loading statistics', error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    return {
        stats,
        loading,
        refresh: loadData
    }
}