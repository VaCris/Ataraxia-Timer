/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleRequestDto } from '../models/ScheduleRequestDto';
import type { ScheduleResponseDto } from '../models/ScheduleResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ScheduleControllerService {
    /**
     * @param id
     * @returns ScheduleResponseDto OK
     * @throws ApiError
     */
    public static getEventById(
        id: string,
    ): CancelablePromise<ScheduleResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedules/{id}',
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
     * @returns ScheduleResponseDto OK
     * @throws ApiError
     */
    public static updateEvent(
        id: string,
        requestBody: ScheduleRequestDto,
    ): CancelablePromise<ScheduleResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/schedules/{id}',
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteEvent(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/schedules/{id}',
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
     * @param start
     * @param end
     * @returns ScheduleResponseDto OK
     * @throws ApiError
     */
    public static getEventsInRange(
        start: string,
        end: string,
    ): CancelablePromise<Array<ScheduleResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedules',
            query: {
                'start': start,
                'end': end,
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
     * @param requestBody
     * @returns ScheduleResponseDto OK
     * @throws ApiError
     */
    public static createEvent(
        requestBody: ScheduleRequestDto,
    ): CancelablePromise<ScheduleResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/schedules',
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
     * @param status
     * @returns ScheduleResponseDto OK
     * @throws ApiError
     */
    public static updateEventStatus(
        id: string,
        status: string,
    ): CancelablePromise<ScheduleResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/schedules/{id}/status',
            path: {
                'id': id,
            },
            query: {
                'status': status,
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
     * @returns ScheduleResponseDto OK
     * @throws ApiError
     */
    public static getUpcomingEvents(): CancelablePromise<Array<ScheduleResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedules/upcoming',
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
