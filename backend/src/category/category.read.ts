import { ReadRedis } from "../infrastructure/redis/redis.read";
import { logger } from "../infrastructure/logger/log";
import { category, categoryResponses } from "./category.type";
import { meta } from "../type/global.type";
import CategoryModel from "./category.model";

// Service responsible for reading category data
export default class ReadCategory {
    // Initialize category model dependency
    constructor(
        private categoryModel = new CategoryModel(),
        private readRedis = new ReadRedis(),
    ) {}

    // Retrieve all categories
    show = async () => {
        try {
            // Fetch category list from database
            const category = await this.categoryModel.show();

            // Build API response
            const res: categoryResponses = {
                status: 200,
                message: "success get category",
                category: category,
            };

            return res;
        } catch (error: any) {
            // Log error for monitoring
            logger.info(error);

            throw {
                status: error.status || 500,
                message: error.message || "internal server error",
                error: error.error || "",
            };
        }
    };

    // Retrieve category with related articles and pagination
    find = async (req: {
        id: number;
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
    }) => {
        try {
            // Fetch category and articles from database
            const category = await this.categoryModel.find(req);

            // Return empty categoruponse if category has no articles
            if (category.article.meta.count < 1) return category;

            // Collect article IDs for Redis view lookup
            const ids: string[] = [];

            category.article.data.forEach((value) => {
                const id = value?.id;

                if (id) {
                    ids.push(String(id));
                }
            });

            // Retrieve latest view counters from Redis
            const redisValue = await this.readRedis.readViews(ids);

            // Override article views with Redis values if available
            for (const [key, value] of Object.entries(redisValue)) {
                if (!value) continue;

                const findable = category.article.data.find(
                    (item) => item?.id == Number(key),
                );

                if (findable) {
                    findable.base_views = Number(value);
                }
            }

            // Build final categoruponse structure
            const result: {
                category: category;
                meta: meta;
            } = {
                category: {
                    id: category.id,
                    name: category.name,
                } as category,
                meta: category.article.meta,
            };

            return result;
        } catch (error: any) {
            // Normalize error response
            throw {
                status: error.status || 500,
                message: error.message || "internal server error",
                error: error.error,
            };
        }
    };
}
