import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { getConnInfo, serveStatic } from "hono/bun";
import { rateLimiter } from "hono-rate-limiter";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "./infrastructure/logger/log";
import category from "./service/routes/category";
import index from "./service/routes";
import schedule from "node-schedule";
import WriteRedis from "./write/writeRedis";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

const writeRedis = new WriteRedis();

const app = new Hono();

// set up cors
app.use(
    "*",
    cors({
        origin: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
    }),
);

// make all request be PrettyJson
app.use("*", prettyJSON());

// csrf set up
app.use(
    "*",
    csrf({
        origin: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
    }),
);

// rate limiting
app.use(
    rateLimiter({
        // limit 200 request / 15 minutes
        windowMs: 15 * 60 * 1000,
        limit: 200,

        // get identity and make anonymous when identity not found
        keyGenerator: (c) => {
            const key =
                c.req.header("x-forwarded-for") ??
                c.req.header("cf-connecting-ip");
            if (key) return key;
            const info = getConnInfo(c);
            return info.remote.address || "anonymous";
        },
    }),
);

app.use("*", async (c, next) => {
    // make uniqueId every request
    const requestId = crypto.randomUUID();
    await next();
    // log every request
    logger.info({
        requestId,
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
    });
});
// make schedule every 5 minutes
const job = schedule.scheduleJob("*/5 * * * *", async () => {
    const redis = await writeRedis.syncData();
    logger.info(redis);
});

// base api end point
app.get("/", async (c) => {
    c.status(200);
    return c.json({ message: "hello from server" });
});

// connect routes to main route
app.route("/article", index)
    .route("/category", category)
    // api end point to get static file
    .use(
        "/static/*",
        serveStatic({
            root: "./public",
            rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
        }),
    );

// error handling
app.onError(async (error: any, c) => {
    // log every error
    logger.error(
        {
            path: c.req.path,
            method: c.req.method,
            status: error.status || 500,
            stack: Number(error.status) == 500 ? error.stack : "validate error",
        },
        error.message,
    );
    // set header response to avoid cors blocked
    c.res.headers.set(
        "Access-Control-Allow-Origin",
        process.env["FRONT_END_URL"] ?? "https://localhost:3000",
    );

    // return custom error data if exist
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

    // default error response
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
