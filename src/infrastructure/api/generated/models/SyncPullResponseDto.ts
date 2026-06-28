/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SyncChangeDto } from './SyncChangeDto';
export type SyncPullResponseDto = {
    changes?: Array<SyncChangeDto>;
    nextCursor?: string;
    hasMore?: boolean;
    serverTime?: string;
};

