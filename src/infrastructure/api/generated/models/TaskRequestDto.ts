/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskRequestDto = {
    title: string;
    description?: string;
    status?: TaskRequestDto.status;
    position?: number;
    dueDate?: string;
    tagIds?: Array<string>;
    boardListId?: string;
};
export namespace TaskRequestDto {
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        DONE = 'DONE',
    }
}

