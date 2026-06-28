/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ScheduleSettingsDto } from '../models/ScheduleSettingsDto';
import type { ScheduleWeekDto } from '../models/ScheduleWeekDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AputrakScheduleControllerService {
    /**
     * @param weekId
     * @returns ScheduleWeekDto OK
     * @throws ApiError
     */
    public static getWeek(
        weekId: string,
    ): CancelablePromise<ScheduleWeekDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule/weeks/{weekId}',
            path: {
                'weekId': weekId,
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
     * @param weekId
     * @param requestBody
     * @returns ScheduleWeekDto OK
     * @throws ApiError
     */
    public static replaceWeek(
        weekId: string,
        requestBody: ScheduleWeekDto,
    ): CancelablePromise<ScheduleWeekDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/schedule/weeks/{weekId}',
            path: {
                'weekId': weekId,
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
     * @returns ScheduleSettingsDto OK
     * @throws ApiError
     */
    public static getSettings(): CancelablePromise<ScheduleSettingsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/schedule/settings',
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
     * @returns ScheduleSettingsDto OK
     * @throws ApiError
     */
    public static updateSettings(
        requestBody: ScheduleSettingsDto,
    ): CancelablePromise<ScheduleSettingsDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/schedule/settings',
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
}
