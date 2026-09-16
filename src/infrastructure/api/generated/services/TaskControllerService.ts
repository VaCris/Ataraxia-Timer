/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskRequestDto } from '../models/TaskRequestDto';
import type { TaskResponseDto } from '../models/TaskResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static updateTask(
        id: string,
        requestBody: TaskRequestDto,
    ): CancelablePromise<TaskResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/tasks/{id}',
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
    public static deleteTask(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/tasks/{id}',
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
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static createTask(
        requestBody: TaskRequestDto,
    ): CancelablePromise<TaskResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/tasks',
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
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static getInboxTasks(): CancelablePromise<Array<TaskResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/inbox',
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
     * @param boardListId
     * @returns TaskResponseDto OK
     * @throws ApiError
     */
    public static getTasksByBoardList(
        boardListId: string,
    ): CancelablePromise<Array<TaskResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/board-list/{boardListId}',
            path: {
                'boardListId': boardListId,
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
