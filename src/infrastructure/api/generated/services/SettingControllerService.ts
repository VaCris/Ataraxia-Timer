/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SettingRequestDto } from '../models/SettingRequestDto';
import type { SettingResponseDto } from '../models/SettingResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SettingControllerService {
    /**
     * @returns SettingResponseDto OK
     * @throws ApiError
     */
    public static getMySettings(): CancelablePromise<SettingResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/settings/me',
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
     * @returns SettingResponseDto OK
     * @throws ApiError
     */
    public static updateMySettings(
        requestBody: SettingRequestDto,
    ): CancelablePromise<SettingResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/settings/me',
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
