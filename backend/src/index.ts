import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { some } from "hono/combine";
import { serveStatic } from "hono/bun";
import { rateLimiter } from "hono-rate-limiter";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "./infrastructure/logger/log";
import category from "./routes/category";
import index from "./routes";
import schedule from "node-schedule";
import WriteRedis from "./events/write";

const writeRedis = new WriteRedis();

const app = new Hono();
app.use(
    "*",
    cors({
        origin: process.env["FRONT_END_URL"] ?? "http://localhost:3000",
        allowHeaders: [
            "Content-Type",
            "Authorization",
            "Access-Control-Allow-Origin",
        ],
        allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);
app.use("*", prettyJSON());

app.use(
    "*",
    csrf({
        origin: process.env["FRONT_END_URL"] ?? "http://localhost:3000",
    }),
);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 1,
    keyGenerator: (c) => {
      const key =
        c.req.header("x-forwarded-for") ?? c.req.header("cf-connecting-ip");
      if (key) return key;
      const info = getConnInfo(c);
      return info.remote.address || "anonymous";
    },
  }),
);

app.use("*", async (c, next) => {
    const requestId = crypto.randomUUID();
    await next();
    logger.info({
        requestId,
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
    });
});
const job = schedule.scheduleJob("*/1 * * * *", async () => {
    const redis = await writeRedis.syncData();
    logger.info(redis);
});

app.get("/", async (c) => {
    const redis = await writeRedis.syncData();
    logger.info(redis);
    return c.json(redis);
});
app.route("/article", index).route("/category", category).use('/static/*', serveStatic({root : "./public"}));
export default {
    port: 2000,
    fetch: app.fetch,
    tls: {
        cert: Bun.file("./localhost.pem"),
        key: Bun.file("./localhost-key.pem"),
    },
};