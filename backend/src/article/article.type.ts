import { RedisKey } from "ioredis";
import { globalResponse, meta } from "../type/global.type";
import { Prisma } from "@infra/database/generated/prisma";

export type article = {
    id: number;
    title: string;
    content: string;
    base_views: number;
    image?: string | null;
    category: {
        category: { id: number; name: string } | null;
    }[];
};

export type articleWithAuthor = article & {
    author_id: string;
    created_at: Date;
    updated_at: Date;
};

export type order = {
    id: Prisma.SortOrder;
    base_views?: Prisma.SortOrder;
};

export type articleRedis = {
    id: RedisKey;
    value: article;
};

export interface articleArrayResponse extends globalResponse {
    article: article[];
}

export type articleMeta = {
    article: article[];
    meta: meta;
};

export interface articleResponse extends globalResponse {
    article: article;
}

export type articlePayload = {
    title: string;
    content: string;
    image?: File | null;
    category: string[];
    profile: {
        author_id: string;
        roles: "admin" | "writer" | "user";
    };
};

export type articleModelPayload = {
    title: string;
    content: string;
    image?: string | null;
    category: string[];
    author_id: string;
};
