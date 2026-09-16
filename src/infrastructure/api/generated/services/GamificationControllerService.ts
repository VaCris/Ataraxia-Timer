/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GamificationStatsDto } from '../models/GamificationStatsDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GamificationControllerService {
    /**
     * @returns any OK
     * @throws ApiError
     */
    public static checkAchievements(): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/gamification/check-achievements',
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
     * @returns GamificationStatsDto OK
     * @throws ApiError
     */
    public static stats(): CancelablePromise<GamificationStatsDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/gamification/stats',
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
     * @param limit
     * @returns UserResponseDto OK
     * @throws ApiError
     */
    public static leaderboard(
        limit: number = 10,
    ): CancelablePromise<Array<UserResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/gamification/leaderboard',
            query: {
                'limit': limit,
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
     * @returns any OK
     * @throws ApiError
     */
    public static achievements(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/gamification/achievements',
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
