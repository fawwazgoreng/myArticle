import Redis, { RedisOptions } from "ioredis";
import { env } from "../../config";
const appName = env.APP_NAME ?? "";
export const prfix = `${appName}:test:`;

export const redisConfig : RedisOptions = {
  port: Number(env.REDIS_PORT),
  host: env.REDIS_HOST,
  keyPrefix: `${prfix}`,
  db: Number(env.REDIS_DB),
}

const redis = new Redis(redisConfig);
export default redis;