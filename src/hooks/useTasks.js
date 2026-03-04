import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '@api/tasks/tasks.service';
import { CreateTaskDto, CreateUpdateTaskDto } from '@api/tasks/dto/task.dto';
import { useAuth } from '@context/AuthContext';
import toast from 'react-hot-toast';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const data = await tasksService.getAll();
            setTasks(data);
        } catch (error) {
            toast.error("Error loading tasks");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchTasks();
    }, [user, fetchTasks]);

    const addTask = async (title, description, tagIds) => {
        try {
            const dto = CreateTaskDto(title, user.id, description, tagIds);
            const newTask = await tasksService.create(dto);
            setTasks(prev => [...prev, newTask]);
            toast.success("Task created successfully");
        } catch (error) {
            toast.error("The task could not be created. Try again later.");
        }
    };

    const toggleTask = async (id, isCompleted) => {
        try {
            const dto = CreateUpdateTaskDto({ isCompleted: !isCompleted });
            await tasksService.update(id, dto);
            setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !isCompleted } : t));
        } catch (error) {
            toast.error("Error updating status. Try again later.");
        }
    };

    return { tasks, loading, addTask, toggleTask, refresh: fetchTasks };
};