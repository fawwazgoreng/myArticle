import { ReadRedis } from "./readRedis";
import WriteRedis from "../write/writeRedis";
import { logger } from "../infrastructure/logger/log";
import articleModel from "../model/article";
import { article, articleArrayResponse, articleMeta } from "../service/types/article";

export default class ReadArticle {
    private articleModel;
    private readRedis;
    private writeRedis;
    constructor() {
        this.articleModel = new articleModel();
        this.readRedis = new ReadRedis();
        this.writeRedis = new WriteRedis();
    }
    show = async (req: {
        page: number;
        title: string;
        time: "newest" | "oldest";
        populer: boolean;
    }) => {
        try {
            let cacheKey = `articles:${req.page}:${req.time}:${req.populer ? "populer" : "unpopuler"}`;
            if (String(req.title).length < 10) cacheKey = cacheKey + `:${req.title}`;
            let article: articleMeta = {
                article: [],
                meta: {
                    firstPage: 1,
                    lastPage: 1,
                    currentPage: 1,
                    count: 10
                }
            };
            const data = await this.readRedis.readAll(cacheKey);
            if (data) {
                article = JSON.parse(data);
            } else {
                const data = await this.articleModel.show(req);
                if (String(req.title).length < 10 && data.article.length > 0) {
                await this.writeRedis.cacheSearch(cacheKey, data);
                }
                article = data;
            }
            const ids : string[] = [];
            article.article.forEach((value) => {
              const id = value.id;
              if (id) {
                ids.push(String(id));
              }
            })
            const redisValue = await this.readRedis.readViews(ids);
            for (const [key , value] of Object.entries(redisValue)) {
              if (!value) continue;
              const findable = article.article.find(item => item.id == Number(key));
              if (findable) {
                findable.base_views = Number(value);
              }
            }
            const res: articleArrayResponse = {
              status: 200,
              message: 'success get article',
              article: article.article,
              meta: article.meta
            };
            return res;
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server error",
                error: error.error,
            };
        }
    };

    find = async (id: number) => {
        try {
            const redisCache = await this.readRedis.readShow(id);
            if (redisCache) return redisCache;
            const article = await new articleModel().find(id);
            return article as  unknown as article;
        } catch (error: any) {
            logger.info(error);
            throw {
                status: error.status || 500,
                message: error.message || "internal server error",
                error: error.error || "",
            };
        }
    };
}
