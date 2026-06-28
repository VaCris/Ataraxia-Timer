import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback } from 'react'
import { RootState } from '@store/index'
import * as actions from '@/features/tasks/store/tasksSlice'
import { CreateTaskDto, UpdateTaskDto } from '@/features/tasks/types/task.dto';

export const useTasks = () => {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state: RootState) => state.tasks);
  const authUser = useSelector((state: RootState) => state.auth.user);

  const fetchTasks = useCallback(() => {
    dispatch(actions.fetchTasksRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!authUser || authUser.isGuest) return;

    dispatch(actions.fetchTasksRequest());
  }, [dispatch, authUser]);

  const addTask = (data: CreateTaskDto) =>
    dispatch(actions.createTaskRequest(data))

  const updateTask = (id: string, data: UpdateTaskDto) =>
    dispatch(actions.updateTaskRequest({ id, data }))

  const toggleTask = (task: any) => {
    dispatch(actions.updateTaskRequest({
      id: task.id,
      data: {
        title: task.title,
        tagIds: task.tags?.map((t: any) => t.id),
        status: task.status === 'DONE' ? 'TODO' : 'DONE'
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