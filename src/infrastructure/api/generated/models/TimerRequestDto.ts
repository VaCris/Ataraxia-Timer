/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TimerRequestDto = {
    duration: number;
    mode: TimerRequestDto.mode;
    taskId?: string;
};
export namespace TimerRequestDto {
    export enum mode {
        POMODORO = 'POMODORO',
        SHORT_BREAK = 'SHORT_BREAK',
        LONG_BREAK = 'LONG_BREAK',
    }
}

