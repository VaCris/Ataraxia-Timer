import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { AuthUser } from '@api/auth/dto/auth.dto';
import { tasksService } from '@api/tasks/tasks.service';
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from '@/api/tasks/dto/task.dto';
import toast from 'react-hot-toast';

export const useTasks = () => {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { status, user: rawUser } = useSelector((state: RootState) => state.auth);
    const user = rawUser as AuthUser | null;

    /**
     * Carga inicial de tareas desde la API
     */
    const fetchTasks = useCallback(async () => {
        // No disparamos peticiones si la sesión se está validando o no ha empezado
        if (status === 'loading' || status === 'idle') return;

        // Si no estamos autenticados, limpiamos tareas y apagamos el loader
        if (status !== 'authenticated' || !user?.id) {
            setTasks([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await tasksService.getAll();
            setTasks(data);
        } catch (error: any) {
            // Solo mostramos error si no es un 401 (que ya maneja el interceptor)
            if (error.response?.status !== 401) {
                console.error('Fetch tasks error:', error);
                toast.error('Could not load your tasks');
            }
        } finally {
            setLoading(false);
        }
    }, [status, user?.id]);

    // Efecto para disparar la carga cuando cambie el estado de autenticación
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    /**
     * Añade una nueva tarea
     */
    const addTask = async (taskData: CreateTaskDto) => {
        if (status !== 'authenticated' || !user?.id) {
            toast.error('Identify yourself to save tasks');
            return;
        }

        try {
            const newTask = await tasksService.create(taskData);
            setTasks(prev => [...prev, newTask]);
            toast.success('Task integrated into your sanctuary');
            return newTask;
        } catch (error: any) {
            const msg = error?.response?.data?.message?.[0] || 'The task could not be created';
            toast.error(msg);
            throw error;
        }
    };

    /**
     * Cambio de estado (completada/pendiente) con Actualización Optimista
     */
    const toggleTask = async (id: string, completed: boolean) => {
        // Guardamos el estado anterior por si falla la red (Rollback)
        const previousTasks = [...tasks];

        // Actualización Optimista: Cambiamos la UI de inmediato
        setTasks(prev =>
            prev.map(t => t.id === id ? { ...t, completed: !completed } : t)
        );

        try {
            const dto: UpdateTaskDto = { completed: !completed };
            await tasksService.update(id, dto);
        } catch (error) {
            // Revertimos si hay error
            setTasks(previousTasks);
            toast.error('Sync failed. Reverting changes...');
        }
    };

    /**
     * Elimina una tarea con Actualización Optimista
     */
    const removeTask = async (id: string) => {
        const previousTasks = [...tasks];

        // Eliminamos de la UI de inmediato
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            await tasksService.delete(id);
            toast.success('Task released');
        } catch (error) {
            // Revertimos si hay error
            setTasks(previousTasks);
            toast.error('Could not delete the task');
        }
    };

    return {
        tasks,
        // El hook está cargando si él mismo busca datos O si la sesión se está validando
        loading: loading || status === 'loading',
        addTask,
        toggleTask,
        removeTask,
        refresh: fetchTasks
    };
};