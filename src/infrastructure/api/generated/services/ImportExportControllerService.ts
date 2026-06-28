/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AputrakBackupDto } from '../models/AputrakBackupDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ImportExportControllerService {
    /**
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static importJson(
        requestBody: AputrakBackupDto,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/import/json',
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
     * @param weekId
     * @returns AputrakBackupDto OK
     * @throws ApiError
     */
    public static exportJson(
        weekId: string,
    ): CancelablePromise<AputrakBackupDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/export/json',
            query: {
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
}
