import redis from "@infra/redis/redis";
import articleModel from "@/article/article.model";
import AppError from "@utils/error";

const ttl = 60 * 60 * 24; // Cache expiration time (24 hours)

// Redis read service for article-related cache operations
export class ReadRedis {

  // Retrieve cached search results using cache key
  readAll = async (cacheKey: string) => {
    return await redis.get(cacheKey);
  }

  // Retrieve multiple article view counters from Redis
  readViews = async (key : string[]) => {
    return await redis.mget(key);
  }

  // Retrieve single article using Redis cache-first strategy
  readShow = async (id : number) => {

    // Attempt to read article cache
    const res = await redis.get(`article:${String(id)}`);

    // If cache miss, fetch article from database
    if (!res) {

        const article = await (new articleModel().findById(id));
        if (!article) {
            throw new AppError(404 , `article id ${id} not found`);
        }

      // Store article in Redis with expiration
      await redis.setex(
        'article:' + String(article.id),
        ttl,
        JSON.stringify(article)
      );

      return article;
    }

    // Parse cached JSON result
    return JSON.parse(res);
  }
}