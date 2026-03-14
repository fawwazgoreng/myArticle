import redis from "../infrastructure/redis/redis";
import articleModel from "../model/article";

const ttl = 60 * 60 * 24;

export class ReadRedis {
    readAll = async (cacheKey: string) => {
        return await redis.get(cacheKey);
    }
    readViews = async (key : string[]) => {
        return await redis.mget(key);
    }
  readShow = async (id : number) => {
    const res = await redis.get(`article:${String(id)}`);
      if (!res) {
      const article = await (new articleModel().find(id));
      const result = await redis.setex('article:' + String(article.id), ttl ,JSON.stringify(article));
      return article
    }
    return JSON.parse(res);
  }
}