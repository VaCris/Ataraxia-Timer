/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthMessageResponseDto } from '../models/AuthMessageResponseDto';
import type { ChangePasswordRequestDto } from '../models/ChangePasswordRequestDto';
import type { EmailVerificationRequestDto } from '../models/EmailVerificationRequestDto';
import type { ForgotPasswordRequestDto } from '../models/ForgotPasswordRequestDto';
import type { GuestLoginRequestDto } from '../models/GuestLoginRequestDto';
import type { LoginRequestDto } from '../models/LoginRequestDto';
import type { LoginResponseDto } from '../models/LoginResponseDto';
import type { RefreshTokenRequestDto } from '../models/RefreshTokenRequestDto';
import type { RegisterRequestDto } from '../models/RegisterRequestDto';
import type { ResendVerificationRequestDto } from '../models/ResendVerificationRequestDto';
import type { ResetPasswordRequestDto } from '../models/ResetPasswordRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthControllerService {
    /**
     * @param requestBody
     * @returns AuthMessageResponseDto OK
     * @throws ApiError
     */
    public static verifyEmail(
        requestBody: EmailVerificationRequestDto,
    ): CancelablePromise<AuthMessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/verify-email',
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
     * @returns AuthMessageResponseDto OK
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: ResetPasswordRequestDto,
    ): CancelablePromise<AuthMessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/reset-password',
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
     * @param origin
     * @returns AuthMessageResponseDto OK
     * @throws ApiError
     */
    public static resendVerification(
        requestBody: ResendVerificationRequestDto,
        origin?: string,
    ): CancelablePromise<AuthMessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/resend-verification',
            headers: {
                'Origin': origin,
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
     * @param requestBody
     * @returns LoginResponseDto OK
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterRequestDto,
    ): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/register',
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
     * @returns LoginResponseDto OK
     * @throws ApiError
     */
    public static refresh(
        requestBody?: RefreshTokenRequestDto,
    ): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/refresh',
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
     * @returns AuthMessageResponseDto OK
     * @throws ApiError
     */
    public static logout(
        requestBody?: RefreshTokenRequestDto,
    ): CancelablePromise<AuthMessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/logout',
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
     * @returns LoginResponseDto OK
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequestDto,
    ): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/login',
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
     * @returns LoginResponseDto OK
     * @throws ApiError
     */
    public static guestLogin(
        requestBody: GuestLoginRequestDto,
    ): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/guest-login',
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
     * @param origin
     * @returns AuthMessageResponseDto OK
     * @throws ApiError
     */
    public static forgotPassword(
        requestBody: ForgotPasswordRequestDto,
        origin?: string,
    ): CancelablePromise<AuthMessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/forgot-password',
            headers: {
                'Origin': origin,
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
     * @param requestBody
     * @returns AuthMessageResponseDto OK
     * @throws ApiError
     */
    public static changePassword(
        requestBody: ChangePasswordRequestDto,
    ): CancelablePromise<AuthMessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/auth/change-password',
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
     * @returns LoginResponseDto OK
     * @throws ApiError
     */
    public static profile(): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/auth/profile',
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
