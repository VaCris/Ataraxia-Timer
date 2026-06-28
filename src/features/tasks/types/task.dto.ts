import { TaskRequestDto, TaskResponseDto } from '@/infrastructure/api/generated';

export type CreateTaskDto = TaskRequestDto;

export type UpdateTaskDto = Partial<CreateTaskDto>;

export interface TaskResponse extends Omit<TaskResponseDto, 'id' | 'title' | 'status'> {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}