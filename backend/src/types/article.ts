import { RedisKey } from "ioredis";
import { globalResponse, meta } from "./global";
import { Prisma } from "../infrastructure/database/generated/prisma";
import { category } from "./category";

export type article = {
  id: number,
  title: string,
  content: string,
  base_views: number,
  image?: string | null,
  category: {
    category: category[] | category
  }
}


export type order = {
  id: Prisma.SortOrder,
  base_views?: Prisma.SortOrder,
}

export type articleRedis = {
  id: RedisKey,
    value: {
      id: number,
      title: string,
      content: string,
      image: string | null,
      base_views: number,
      created_at?: Date,
      updated_at?: Date,
  }
}

export interface articleArrayResponse extends globalResponse {
  article : article[]
}

export type articleMeta = {
    article: article[],
    meta: meta
}

export interface articleResponse extends globalResponse {
  article : article
}


export type articlePayload = {
  title: string,
  content: string,
  image?: File | null,
  category: string[]
}

export type articleModelPayload = {
  title: string,
  content: string,
  image?: string | null,
  category: string[]
}
