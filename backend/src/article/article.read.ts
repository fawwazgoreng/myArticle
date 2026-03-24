import category from "../category/category.route";
import { logger } from "../infrastructure/logger/log";
import { ReadRedis } from "../infrastructure/redis/redis.read";
import WriteRedis from "../infrastructure/redis/redis.write";
import ArticleModel from "./article.model";
import { article, articleArrayResponse, articleMeta } from "./article.type";

// Service responsible for reading articles with Redis caching
export default class ReadArticle {

    // Initialize dependencies for database and Redis operations
    constructor(
        private articleModel = new ArticleModel(),
        private readRedis = new ReadRedis(),
        private writeRedis = new WriteRedis(),
    ){}

    // Retrieve paginated articles with Redis cache-first strategy
    show = async (req: {
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
        category?: string
    }) => {
        try {

            // Generate Redis cache key based on search parameters
            let cacheKey = `articles:${req.page}:${req.time}:${req.populer ? "populer" : "unpopuler"}${req.category ? ":"+req.category : ""}`;
            // Append title filter if short to reduce cache fragmentation
            if (String(req.title).length < 10) cacheKey = cacheKey + `:${req.title}`;

            // Default article response structure
            let article: articleMeta = {
                article: [],
                meta: {
                    firstPage: 1,
                    lastPage: 1,
                    currentPage: 1,
                    count: 10
                }
            };

            // Attempt to read cached article data
            const data = await this.readRedis.readAll(cacheKey);
            if (data) {
                // Parse cached JSON data
                article = {mesasge: "testing" ,...JSON.parse(data) };

            } else {

                // Fetch data from database if cache miss
                const data = await this.articleModel.show(req);

                // Cache result if search title is short
                if (String(req.title).length < 10 && data.article.length > 0) {
                    await this.writeRedis.cacheSearch(cacheKey, data);
                }

                article = data;
            }

            // Collect article IDs for Redis view lookup
            const ids : string[] = [];

            if (article.article.length < 1) return {
                status: 200,
                message: 'success get article',
                article: article.article,
                meta: article.meta
            };
            article.article.forEach((value) => {
                const id = value.id;
                if (id) {
                    ids.push(String(id));
                }
            });

            // Retrieve updated view counts from Redis
            const redisValue = await this.readRedis.readViews(ids);

            // Override database views with Redis values if available
            for (const [key , value] of Object.entries(redisValue)) {

                if (!value) continue;

                const findable = article.article.find(item => item.id == Number(key));

                if (findable) {
                    findable.base_views = Number(value);
                }
            }

            // Build final API response
            const res: articleArrayResponse = {
                status: 200,
                message: 'success get article',
                article: article.article,
                meta: article.meta
            };

            return res;

        } catch (error: any) {

            // Normalize error response
            throw {
                status: error.status || 500,
                message: error.message || "internal server error",
                error: error.error,
            };
        }
    };

    // Retrieve single article with Redis cache lookup
    find = async (id: number) => {
        try {

            // Attempt to read cached article
            const redisCache = await this.readRedis.readShow(id);

            if (redisCache) return redisCache;

            // Fetch article from database if cache miss
            const article = await this.articleModel.find(id);

            return article as article;

        } catch (error: any) {

            // Log error for debugging
            logger.info(error);

            throw {
                status: error.status || 500,
                message: error.message || "internal server error",
                error: error.error || "",
            };
        }
    };
}