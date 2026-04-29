import { ReadRedis } from "@infra/redis/redis.read";
import { category } from "@/category/category.type";
import { meta } from "@type/global.type";
import CategoryModel from "@/category/category.model";
import { findPage } from "@utils/db/findPage";
import { Prisma } from "@infra/database/generated/prisma";
import AppError from "@utils/error";

// Service responsible for reading category data
export default class ReadCategory {
    // Initialize category model dependency
    constructor(
        private categoryModel = new CategoryModel(),
        private readRedis = new ReadRedis(),
    ) {}

    // Retrieve all categories
    show = async () => {
        // Fetch category list from database
        return await this.categoryModel.show();
    };

    // Retrieve category with related articles and pagination
    find = async (req: {
        id: number;
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
    }) => {
        // Fetch category and articles from database
        const page = findPage(req);

        // Determine sorting direction for article time
        const isNew: Prisma.SortOrder = page.time == "newest" ? "desc" : "asc";

        // Determine sorting direction for popularity
        const populer: Prisma.SortOrder = req.populer ? "desc" : "asc";

        // Build dynamic sorting configuration
        let orderBy: any = [];

        if (req.populer) orderBy.push({ base_views: populer });

        orderBy.push({ article_id: isNew });

        const take = 10;
        const request = { take, orderBy, id: req.id };
        const [category, count] = await this.categoryModel.find(request);
        // Throw error if category not found
        if (!category?.id) {
            throw new AppError(404,"category id " + req.id + " not found",);
        }

        // Build pagination metadata
        const meta: meta = {
            firstPage: 1,
            currentPage: req.page,
            lastPage: Math.ceil(count / take),
            count,
        };

        // Transform relation result to pure article array
        const res = {
            ...category,
            article: {
                data: category.article.map((item) => item.article),
                meta: meta,
            },
        };
        // Return empty categoruponse if category has no articles
        if (res.article.meta.count < 1) return res;

        // Collect article IDs for Redis view lookup
        const ids: string[] = [];

        res.article.data.forEach((value) => {
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

            const findable = res.article.data.find(
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
            meta: res.article.meta,
        };

        return result;
    };
}
