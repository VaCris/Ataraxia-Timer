import { TagRequestDto, TagResponseDto } from '@/infrastructure/api/generated';

export type CreateTagDto = TagRequestDto;

export type UpdateTagDto = Partial<CreateTagDto>;

export interface TagResponse extends Omit<TagResponseDto, 'id' | 'name'> {
    id: string;
    name: string;
}