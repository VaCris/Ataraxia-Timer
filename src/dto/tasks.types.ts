export interface CreateTaskDto {
    title: string;
    tag?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
    completed?: boolean;
}

export interface TaskResponse extends CreateTaskDto {
    id: string;
    userId: string;
    completed: boolean;
    createdAt: string;
}