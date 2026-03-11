import { useState, useEffect, useCallback } from 'react'
import { tasksService } from '@api/tasks/tasks.service'
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '@api/tasks/dto/task.dto'
import { useAuth } from '@context/AuthContext'
import toast from 'react-hot-toast'

export const useTasks = () => {
    const [tasks, setTasks] = useState<TaskResponse[]>([])
    const [loading, setLoading] = useState(true)

    const { user, isAuthenticated } = useAuth()

    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated || !user?.id) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const data = await tasksService.getAll()
            setTasks(data)
        } catch {
            toast.error('Error loading tasks')
        } finally {
            setLoading(false)
        }
    }, [isAuthenticated, user?.id])

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    const addTask = async (taskData: CreateTaskDto) => {
        if (!user?.id) {
            toast.error('You must log in to create tasks')
            return
        }

        try {
            const newTask = await tasksService.create(taskData)
            setTasks(prev => [...prev, newTask])
            toast.success('Task created successfully')
        } catch (error: any) {
            toast.error(error?.response?.data?.message?.[0] || 'The task could not be created')
        }
    }

    const toggleTask = async (id: string, completed: boolean) => {
        try {
            const dto: UpdateTaskDto = { completed: !completed }
            await tasksService.update(id, dto)

            setTasks(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, completed: !completed } : t
                )
            )
        } catch {
            toast.error('Error updating task')
        }
    }

    const removeTask = async (id: string) => {
        try {
            await tasksService.delete(id)
            setTasks(prev => prev.filter(t => t.id !== id))
            toast.success('Task deleted')
        } catch {
            toast.error('Error deleting task')
        }
    }

    return {
        tasks,
        loading,
        addTask,
        toggleTask,
        removeTask,
        refresh: fetchTasks
    }
}