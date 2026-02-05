export interface CreateTaskDto {
    title: string;
    tag?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
    title?: string;
    tag: string;
    completed?: boolean;
}

export interface TaskResponse extends CreateTaskDto {
    id: string;
    userId: string;
    createdAt: string;
}