/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteAccountRequestDto } from '../models/DeleteAccountRequestDto';
import type { DeleteUserRequestDto } from '../models/DeleteUserRequestDto';
import type { UpdateUserInfoRequestDto } from '../models/UpdateUserInfoRequestDto';
import type { UpdateUserPfpRequestDto } from '../models/UpdateUserPfpRequestDto';
import type { UserProfileResponseDto } from '../models/UserProfileResponseDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @param requestBody
     * @returns UserResponseDto OK
     * @throws ApiError
     */
    public static updateInfo(
        requestBody: UpdateUserInfoRequestDto,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/me/info',
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
     * @returns UserResponseDto OK
     * @throws ApiError
     */
    public static getMe(): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
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
     * @returns any OK
     * @throws ApiError
     */
    public static deleteOwnAccount(
        requestBody: DeleteAccountRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/me',
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
     * @returns UserResponseDto OK
     * @throws ApiError
     */
    public static updateInfo1(
        requestBody: UpdateUserInfoRequestDto,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/me',
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
     * @returns any OK
     * @throws ApiError
     */
    public static updateAvatar(
        requestBody: UpdateUserPfpRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/me/avatar',
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
     * @returns UserProfileResponseDto OK
     * @throws ApiError
     */
    public static getPublicProfile(
        id: string,
    ): CancelablePromise<UserProfileResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/profile/{id}',
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
     * @param requestBody
     * @returns any OK
     * @throws ApiError
     */
    public static adminDeleteUser(
        requestBody: DeleteUserRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/admin/purge',
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
