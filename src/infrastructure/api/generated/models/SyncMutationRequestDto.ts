/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JsonNode } from './JsonNode';
export type SyncMutationRequestDto = {
    clientMutationId: string;
    entityType: string;
    entityId?: string;
    operation: string;
    payload?: JsonNode;
};

