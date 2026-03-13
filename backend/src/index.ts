import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { getConnInfo, serveStatic } from "hono/bun";
import { rateLimiter } from "hono-rate-limiter";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "./infrastructure/logger/log";
import category from "./routes/category";
import index from "./routes";
import schedule from "node-schedule";
import WriteRedis from "./events/write";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

const writeRedis = new WriteRedis();

const app = new Hono();
app.use(
    "*",
    cors({
        origin: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
        allowHeaders: [
            "Content-Type",
            "Authorization",
            // "Access-Control-Allow-Origin",
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
        origin: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
    }),
);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 200,
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
app.route("/article", index).route("/category", category).use('/static/*', serveStatic({ root: "./public", rewriteRequestPath: (path) => path.replace(/^\/static/, '') }));
app.onError(async (error: any, c) => {
  logger.error(
    {
      path: c.req.path,
      method: c.req.method,
      status: error.status || 500,
      stack: Number(error.status) == 500 ? error.stack : "validate error",
    },
    error.message,
  );
    c.res.headers.set("Access-Control-Allow-Origin", process.env["FRONT_END_URL"] ?? "https://localhost:3000");
  if (error instanceof HTTPException) {
    const res = error.getResponse();
    const body =
      (await res
        .clone()
        .json()
        .catch(() => null)) || (await res.clone().text());
    c.status((Number(body.status) as StatusCode) || 500);
    return c.json(body);
  }
  c.status((Number(error.status) as StatusCode) || 500);
  return c.json({
    status: error.status || 500,
    message: error.message || "internal server error",
    error: error.error || "",
  });
});
export default {
    port: 2000,
    fetch: app.fetch,
    tls: {
        cert: Bun.file("./localhost.pem"),
        key: Bun.file("./localhost-key.pem"),
    },
};