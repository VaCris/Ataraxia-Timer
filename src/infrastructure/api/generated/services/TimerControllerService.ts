/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimerRequestDto } from '../models/TimerRequestDto';
import type { TimerResponseDto } from '../models/TimerResponseDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TimerControllerService {
    /**
     * @param requestBody
     * @returns TimerResponseDto OK
     * @throws ApiError
     */
    public static createTimer(
        requestBody: TimerRequestDto,
    ): CancelablePromise<TimerResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/timers',
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
     * @param id
     * @returns TimerResponseDto OK
     * @throws ApiError
     */
    public static getTimerById(
        id: string,
    ): CancelablePromise<TimerResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/timers/{id}',
            path: {
                'id': id,
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
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteTimer(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/timers/{id}',
            path: {
                'id': id,
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
    /**
     * @param id
     * @param requestBody
     * @returns TimerResponseDto OK
     * @throws ApiError
     */
    public static updateTimer(
        id: string,
        requestBody: TimerRequestDto,
    ): CancelablePromise<TimerResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/timers/{id}',
            path: {
                'id': id,
            },
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
     * @param id
     * @returns UserResponseDto OK
     * @throws ApiError
     */
    public static completeTimer(
        id: string,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/timers/{id}/complete',
            path: {
                'id': id,
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
    /**
     * @returns TimerResponseDto OK
     * @throws ApiError
     */
    public static getUserHistory(): CancelablePromise<Array<TimerResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/timers/history',
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
