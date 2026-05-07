import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import { RootState } from '@store/index'
import * as actions from '@/features/tasks/store/tasksSlice'
import { CreateTaskDto, UpdateTaskDto } from '@/features/tasks/types/task.dto';

export const useTasks = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state: RootState) => state.tasks);

  const fetchTasks = useCallback(() => {
    dispatch(actions.fetchTasksRequest());
  }, [dispatch]);

  useEffect(() => {
    dispatch(actions.fetchTasksRequest())
  }, [dispatch])

  const addTask = (data: CreateTaskDto) =>
    dispatch(actions.createTaskRequest(data))

  const updateTask = (id: string, data: UpdateTaskDto) =>
    dispatch(actions.updateTaskRequest({ id, data }))

  const toggleTask = (task: UpdateTaskDto & { id: string }) => {
    dispatch(actions.updateTaskRequest({
      id: task.id,
      data: {
        title: task.title,
        tag: task.tag,
        completed: !task.completed
      }
    }));
  };

  const removeTask = (id: string) =>
    dispatch(actions.deleteTaskRequest(id))

  return {
    tasks: items,
    loading,
    error,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
    refresh: fetchTasks
  };
}