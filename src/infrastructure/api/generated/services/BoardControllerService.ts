/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardListRequestDto } from '../models/BoardListRequestDto';
import type { BoardListResponseDto } from '../models/BoardListResponseDto';
import type { BoardRequestDto } from '../models/BoardRequestDto';
import type { BoardResponseDto } from '../models/BoardResponseDto';
import type { InviteMemberRequestDto } from '../models/InviteMemberRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BoardControllerService {
    /**
     * @returns BoardResponseDto OK
     * @throws ApiError
     */
    public static getUserBoards(): CancelablePromise<Array<BoardResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/boards',
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
     * @returns BoardResponseDto OK
     * @throws ApiError
     */
    public static createBoard(
        requestBody: BoardRequestDto,
    ): CancelablePromise<BoardResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/boards',
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
     * @param requestBody
     * @returns BoardResponseDto OK
     * @throws ApiError
     */
    public static inviteMember(
        id: string,
        requestBody: InviteMemberRequestDto,
    ): CancelablePromise<BoardResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/boards/{id}/members',
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
     * @param boardId
     * @param requestBody
     * @returns BoardListResponseDto OK
     * @throws ApiError
     */
    public static createList(
        boardId: string,
        requestBody: BoardListRequestDto,
    ): CancelablePromise<BoardListResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/boards/{boardId}/lists',
            path: {
                'boardId': boardId,
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
     * @returns BoardResponseDto OK
     * @throws ApiError
     */
    public static getBoardById(
        id: string,
    ): CancelablePromise<BoardResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/boards/{id}',
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
    public static deleteBoard(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/boards/{id}',
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
     * @param listId
     * @returns any OK
     * @throws ApiError
     */
    public static deleteList(
        listId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/boards/lists/{listId}',
            path: {
                'listId': listId,
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
