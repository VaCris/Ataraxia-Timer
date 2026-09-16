/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TimerResponseDto = {
    id?: string;
    duration?: number;
    mode?: TimerResponseDto.mode;
    completed?: boolean;
    taskId?: string;
    createdAt?: string;
};
export namespace TimerResponseDto {
    export enum mode {
        POMODORO = 'POMODORO',
        SHORT_BREAK = 'SHORT_BREAK',
        LONG_BREAK = 'LONG_BREAK',
    }
}

