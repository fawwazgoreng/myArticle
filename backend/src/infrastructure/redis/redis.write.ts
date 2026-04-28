import { RedisKey } from "ioredis";
import redis, { prfix } from "./redis";
import { article, articleMeta } from "../../article/article.type";
import { logger } from "../logger/log";
import WriteArticle from "../../article/article.write";

export const ttl = 60 * 60 * 24; // Cache expiration time (24 hours)

// Redis write service for caching and counter synchronization
export default class WriteRedis {
    // Increment article view counter in Redis
    increment = async (id: RedisKey) => {
        const res = await redis.incr(id);

        if (!res) {
            return 404;
        }

        return res;
    };

    // Cache newly created article and initialize view counter
    newArticle = async (req: article) => {
        // Cache full article object
        const res = await redis.setex(
            `article:` + req.id,
            ttl,
            JSON.stringify(req),
        );

        // Initialize view counter
        await redis.set(String(req.id), req.base_views ?? 0);

        if (!res) {
            return 404;
        }

        return res;
    };

    // Cache search result for article listing
    cacheSearch = async <T>(key: string, val: T) => {
        await redis.setex(key, ttl, JSON.stringify(val));
    };

    // Remove article cache and view counter
    delete = async (id: RedisKey) => {
        // Delete cached article object
        await redis.del("article:" + id);

        // Delete view counter key
        const res = await redis.del(id);

        if (!res) {
            return 404;
        }

        return res;
    };

    // Sync Redis view counters back to database
    syncData = async () => {
        // Retrieve all Redis keys
        const keys = await redis.keys("*");

        if (!keys.length) return;

        // Remove Redis prefix from keys
        const key: RedisKey[] = keys.map((k) => k.replace(prfix, ""));

        // Retrieve values for all keys
        const value = await redis.mget(key);

        // Build key-value mapping for syncing
        const data = keys
            .map((key, index) => ({
                key,
                val: value[index],
            }))
            .filter((value) => value.key != null && value.key != null)
            .filter((item) => Number(item.val) != 0);

        if (!data) return;

        // Sync Redis counters to database
        const res: any = await new WriteArticle().sync(data);

        return res;
    };
}
