import Redis, { RedisOptions } from "ioredis";
const appName = process.env['APP_NAME'] ?? "";
// const node_env = process.env['NODE_ENV'] ?? "production";
export const prfix = `${appName}:test:`;

export const redisConfig : RedisOptions = {
  port: Number(process.env['REDIS_PORT']) ?? 6379,
  host: process.env['REDIS_HOST'] ?? '127.0.0.1',
  keyPrefix: `${prfix}`,
  db: Number(process.env['REDIS_DB']) ?? 0,
}

const redis = new Redis(redisConfig);
export default redis;