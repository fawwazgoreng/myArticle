import redis from "../config/redis";
import { logger } from "../infrastructure/logger/log";
import { articleRedis } from "../types/article";

export class ReadRedis {
  readAll = async (req : string[]) => {
    const res = (await redis.mget(req)).filter(Boolean);
    logger.error(res);
    return res;
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