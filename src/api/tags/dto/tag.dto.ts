export interface CreateTagDto {
    name: string;
    color?: string;
}

export interface UpdateTagDto extends Partial<CreateTagDto> {}

export interface TagResponse extends CreateTagDto {
    id: string;
    userId: string;
}