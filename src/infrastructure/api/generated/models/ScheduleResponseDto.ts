/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ScheduleResponseDto = {
    id?: string;
    title?: string;
    notes?: string;
    startTime?: string;
    endTime?: string;
    colorTheme?: string;
    activityType?: string;
    status?: ScheduleResponseDto.status;
    linkedTaskId?: string;
    linkedTaskTitle?: string;
};
export namespace ScheduleResponseDto {
    export enum status {
        PENDING = 'PENDING',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED = 'COMPLETED',
    }
}

