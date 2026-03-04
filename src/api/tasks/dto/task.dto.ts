export interface CreateTaskDto {
    title: string;
    description?: string;
    userId: string;
    tagIds?: string[];
}

export interface UpdateTaskDto {
    title?: string;
    description?: string;
    isCompleted?: boolean;
    tagIds?: string[];
}

export const CreateTaskDto = (
    title: string, 
    userId: string, 
    description: string = '', 
    tagIds: string[] = []
): CreateTaskDto => ({
    title,
    description,
    userId,
    tagIds
});

export const CreateUpdateTaskDto = (data: Partial<UpdateTaskDto>): UpdateTaskDto => {
    const dto: UpdateTaskDto = {};
    if (data.title !== undefined) dto.title = data.title;
    if (data.description !== undefined) dto.description = data.description;
    if (data.isCompleted !== undefined) dto.isCompleted = data.isCompleted;
    if (data.tagIds !== undefined) dto.tagIds = data.tagIds;
    return dto;
};