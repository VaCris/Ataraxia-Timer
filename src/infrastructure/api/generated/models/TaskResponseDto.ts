/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TagResponseDto } from './TagResponseDto';
export type TaskResponseDto = {
    id?: string;
    title?: string;
    description?: string;
    status?: TaskResponseDto.status;
    position?: number;
    dueDate?: string;
    tags?: Array<TagResponseDto>;
    boardListId?: string;
    totalPomodoros?: number;
};
export namespace TaskResponseDto {
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        DONE = 'DONE',
    }
}

