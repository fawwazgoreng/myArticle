import { RedisKey } from "ioredis";
import { globalResponse, meta } from "../type/global.type";
import { Prisma } from "../infrastructure/database/generated/prisma";

export type comment = {
    id: number;
    user_id: string;
    content: string;
    created_at: Date;
    updated_at?: Date;
    user: {
        id: string;
        username: string;
        roles: "admin" | "writer" | "user"
    };
};

export type order = {
    id: Prisma.SortOrder;
    base_views?: Prisma.SortOrder;
};

export type commentRedis = {
    id: RedisKey;
    value: comment;
};

export interface commentArrayResponse extends globalResponse {
    comment: comment[];
}

export type commentMeta = {
    comment: comment[];
    meta: meta;
};

export interface commentResponse extends globalResponse {
    comment: comment;
}

export type commentPayload = {
    user_id: string;
    content: string;
    article_id: number;
};
