import { RedisKey } from "ioredis";
import { globalResponse } from "./global";
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
  value: string | number | null
}

export interface articleArrayResponse extends globalResponse {
  article : article[]
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
