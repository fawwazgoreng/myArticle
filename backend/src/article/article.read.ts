import { Prisma } from "../infrastructure/database/generated/prisma";
import { ReadRedis } from "../infrastructure/redis/redis.read";
import WriteRedis from "../infrastructure/redis/redis.write";
import { meta } from "../type/global.type";
import { findPage } from "../utils/db/findPage";
import ArticleModel from "./article.model";
import { article, articleMeta } from "./article.type";
import AppError from "../utils/error";

// Service responsible for reading articles with Redis caching
export default class ReadArticle {
    // Initialize dependencies for database and Redis operations
    constructor(
        private articleModel = new ArticleModel(),
        private readRedis = new ReadRedis(),
        private writeRedis = new WriteRedis(),
    ) {}

    // Retrieve paginated articles with Redis cache-first strategy
    show = async (req: {
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
        category?: string;
    }) => {
        let cacheKey = `articles:${req.page}:${req.time}:${req.populer ? "populer" : "unpopuler"}${req.category ? ":" + req.category : ""}`;
        if (String(req.title).length < 10)
            cacheKey = cacheKey + `:${req.title}`;

        let article: articleMeta = {
            article: [],
            meta: {
                firstPage: 1,
                lastPage: 1,
                currentPage: 1,
                count: 10,
            },
        };

        const data = await this.readRedis.readAll(cacheKey);

        if (data) {
            article = JSON.parse(data);
        } else {
            const page = findPage(req);

            const isNew: Prisma.SortOrder =
                page.time === "newest" ? "desc" : "asc";

            const populer: Prisma.SortOrder = req.populer ? "desc" : "asc";

            const orderBy: any[] = [];

            if (req.populer) orderBy.push({ base_views: populer });
            orderBy.push({ id: isNew });

            const take = 30;
            const skip = (req.page - 1) * take;

            const where: Prisma.ArticleWhereInput = {
                title: {
                    startsWith: req.title ?? "",
                },
                ...(req.category && {
                    category: {
                        every: {
                            category: {
                                name: {
                                    equals: req.category,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                }),
            };

            const dataDb = await this.articleModel.show({
                take,
                skip,
                orderBy,
                where,
            });

            const meta: meta = {
                firstPage: 1,
                currentPage: req.page,
                lastPage: Math.ceil(dataDb.count / take),
                count: dataDb.count,
            };

            const res: articleMeta = {
                article: dataDb.article as article[],
                meta,
            };

            if (String(req.title).length < 10 && dataDb.article.length > 0) {
                await this.writeRedis.cacheSearch(cacheKey, res);
            }

            article = res;
        }

        if (article.article.length < 1) return article;

        const ids = article.article.map((item) => String(item.id));

        const redisValue = await this.readRedis.readViews(ids);

        for (const [key, value] of Object.entries(redisValue)) {
            if (!value) continue;

            const findable = article.article.find(
                (item) => item.id === Number(key),
            );

            if (findable) {
                findable.base_views = Number(value);
            }
        }

        return article;
    };

    // Retrieve single article with Redis cache lookup
    find = async (id: number) => {
        const redisCache = await this.readRedis.readShow(id);

        if (redisCache) return redisCache;

        const article = await this.articleModel.find(id);

        if (!article?.id) {
            throw new AppError(
                404,
                `article id ${id} not found`,
                "ARTICLE_NOT_FOUND",
            );
        }

        return article as article;
    };
}