export interface CreateTagDto {
    name: string;
    color?: string;
}

export interface UpdateTagDto {
    name?: string;
    color?: string;
}

export const CreateTagDto = (name: string, color: string): CreateTagDto => ({
    name,
    color
});

export const UpdateTagDto = (data: Partial<UpdateTagDto>): UpdateTagDto => {
    const dto: UpdateTagDto = {};
    if (data.name !== undefined) dto.name = data.name;
    if (data.color !== undefined) dto.color = data.color;
    return dto;
};