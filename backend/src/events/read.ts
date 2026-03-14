import redis from "../config/redis";
import { articleRedis } from "../types/article";

export class ReadRedis {
    readAll = async (cacheKey: string) => {
        return await redis.get(cacheKey);
    }
    readViews = async (key : string[]) => {
        return await redis.mget(key);
    }
  readShow = async (req : articleRedis) => {
      const res = await redis.get(req.id);
    if (!res) {
      const result = await redis.set(req.id, String(req.value));
      return result
    }
    return res;
  }
}