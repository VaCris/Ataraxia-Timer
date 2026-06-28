/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ScheduleRequestDto = {
    title: string;
    notes?: string;
    startTime: string;
    endTime: string;
    colorTheme?: string;
    activityType?: string;
    status?: ScheduleRequestDto.status;
    linkedTaskId?: string;
    endTimeValid?: boolean;
};
export namespace ScheduleRequestDto {
    export enum status {
        PENDING = 'PENDING',
        IN_PROGRESS = 'IN_PROGRESS',
        COMPLETED = 'COMPLETED',
    }
}

