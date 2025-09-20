import { z } from 'zod';

interface PaginationQuery {
    size?: number;
    after?: string;
}
interface PaginatedResult<T> {
    data: T[];
    nextCursor?: string;
}
declare const DEFAULT_PAGE_SIZE = 25;
declare function normalizePagination(query: PaginationQuery): Required<PaginationQuery>;

interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, unknown>;
}
declare function createProblemDetails(init: ProblemDetails): ProblemDetails;

declare const ListApplicationsResponse: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        criticality: z.ZodString;
        primaryCloud: z.ZodString;
        tags: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        criticality: string;
        primaryCloud: string;
        tags: Record<string, any>[];
    }, {
        id: string;
        name: string;
        criticality: string;
        primaryCloud: string;
        tags: Record<string, any>[];
    }>, "many">;
    meta: z.ZodObject<{
        nextCursor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        nextCursor?: string | null | undefined;
    }, {
        nextCursor?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    data: {
        id: string;
        name: string;
        criticality: string;
        primaryCloud: string;
        tags: Record<string, any>[];
    }[];
    meta: {
        nextCursor?: string | null | undefined;
    };
}, {
    data: {
        id: string;
        name: string;
        criticality: string;
        primaryCloud: string;
        tags: Record<string, any>[];
    }[];
    meta: {
        nextCursor?: string | null | undefined;
    };
}>;
type ListApplicationsResponse = z.infer<typeof ListApplicationsResponse>;
declare class InventoryClient {
    private readonly http;
    constructor(baseURL: string, token?: string);
    listApplications(params?: Record<string, string | number | undefined>): Promise<ListApplicationsResponse>;
}

interface DeploymentEvent {
    repo: string;
    commit: string;
    image: string;
    environment: string;
    serviceName: string;
    labels?: Record<string, string>;
    timestamp?: string;
}
declare function sendDeploymentEvent(event: DeploymentEvent, options?: {
    secret?: string;
    url?: string;
}): Promise<void>;

export { DEFAULT_PAGE_SIZE, DeploymentEvent, InventoryClient, ListApplicationsResponse, PaginatedResult, PaginationQuery, ProblemDetails, createProblemDetails, normalizePagination, sendDeploymentEvent };
