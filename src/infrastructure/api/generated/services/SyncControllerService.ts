/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SyncPullResponseDto } from '../models/SyncPullResponseDto';
import type { SyncPushRequestDto } from '../models/SyncPushRequestDto';
import type { SyncPushResponseDto } from '../models/SyncPushResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SyncControllerService {
    /**
     * @param requestBody
     * @returns SyncPushResponseDto OK
     * @throws ApiError
     */
    public static push(
        requestBody: SyncPushRequestDto,
    ): CancelablePromise<SyncPushResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sync/batch',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                429: `Too Many Requests`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns SyncPushResponseDto OK
     * @throws ApiError
     */
    public static push1(
        requestBody: SyncPushRequestDto,
    ): CancelablePromise<SyncPushResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/sync/push',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                429: `Too Many Requests`,
            },
        });
    }
    /**
     * @param cursor
     * @param limit
     * @param deviceId
     * @param entityTypes
     * @returns SyncPullResponseDto OK
     * @throws ApiError
     */
    public static pull(
        cursor?: string,
        limit: number = 100,
        deviceId?: string,
        entityTypes?: Array<string>,
    ): CancelablePromise<SyncPullResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/sync/pull',
            query: {
                'cursor': cursor,
                'limit': limit,
                'deviceId': deviceId,
                'entityTypes': entityTypes,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                409: `Conflict`,
                429: `Too Many Requests`,
            },
        });
    }
}
