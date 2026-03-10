import { RedisKey } from "ioredis";
import redis, { prfix } from "../config/redis";
import { articleRedis } from "../types/article";
import articleModel from "../model/article";
import { logger } from "../infrastructure/logger/log";

const ttl = 60 * 60 * 24;

export default class WriteRedis {
  increment = async (id: RedisKey) => {
    const res = await redis.incr(id);
    if (!res) {
      return 404;
    }
    return res;
  };

    newArticle = async (req: articleRedis) => {
    const res = await redis.setex(`article:` + req.id, ttl, JSON.stringify(req.value));
    await redis.set(req.id, req.value.base_views ?? 0);
    if (!res) {
      return 404;
    }
    return res;
  };


    delete = async (id: RedisKey) => {
    await redis.del("article:" + id);
    const res = await redis.del(id);
    if (!res) {
      return 404;
    }
    return res;
  };
  
  syncData = async () => {
    try {
      const keys = await redis.keys("*");
      if (!keys.length) return;
      const key : RedisKey[] = keys.map(k => k.replace(prfix,''));
      const value = await redis.mget(key);
      const data = keys.map((key, index) => ({
        key,
        val: value[index]
      })).filter(value => value.key != null && value.key != null).filter(item => Number(item.val) != 0);
      if (!data) return;
      // const payload =
      logger.info(data);
      const res : any = await new articleModel().sync(data);
      return res;
    } catch (error : any) {
      return {
        status: 500,
        message: error.message || "internal server error"
      }
    }
  }
}
