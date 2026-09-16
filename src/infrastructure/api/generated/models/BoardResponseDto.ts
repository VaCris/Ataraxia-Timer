/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardListResponseDto } from './BoardListResponseDto';
export type BoardResponseDto = {
    id?: string;
    title?: string;
    description?: string;
    color?: string;
    ownerId?: string;
    memberIds?: Array<string>;
    lists?: Array<BoardListResponseDto>;
};

