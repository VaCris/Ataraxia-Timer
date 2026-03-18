import { useState, useEffect } from 'react'
import { timersService } from '@api/timers/timers.service'
import toast from 'react-hot-toast'

export const usePomodoro = (initialMinutes = 25) => {
    const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | null = null

        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(p => p - 1), 1000)
        } else if (timeLeft === 0) {
            handleFinished()
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [isActive, timeLeft])

    const handleFinished = async () => {
        setIsActive(false)

        try {
            await timersService.create({
                duration: initialMinutes * 60
            })

            toast.success('Session completed')
        } catch {
            toast.error('Failed to save session')
        }
    }

    const toggleTimer = () => setIsActive(p => !p)

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(initialMinutes * 60)
    }

    return { timeLeft, isActive, toggleTimer, resetTimer }
}