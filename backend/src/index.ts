import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { getConnInfo, serveStatic } from "hono/bun";
import { rateLimiter } from "hono-rate-limiter";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "./infrastructure/logger/log";
import category from "./category/category.route";
import index from "./article/article.route";
import admin from "./admin/admin.route";
import schedule from "node-schedule";
import WriteRedis from "./infrastructure/redis/redis.write";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";

// Initialize Redis writer for sync jobs
const writeRedis = new WriteRedis();

// Initialize Hono application
const app = new Hono();


// Enable CORS for frontend communication
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


// Format all responses as pretty JSON (dev readability)
app.use("*", prettyJSON());


// Protect routes against CSRF attacks
app.use(
    "*",
    csrf({
        origin: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
    }),
);


// Limit request rate per client IP
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 200, // max 200 requests

        // Identify client IP
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


// Log every request with unique request id
app.use("*", async (c, next) => {

    // Generate request identifier
    const requestId = crypto.randomUUID();

    await next();

    // Log request metadata
    logger.info({
        requestId,
        method: c.req.method,
        path: c.req.path,
        status: c.res.status,
    });
});


// Schedule Redis view counter sync every 5 minutes
const job = schedule.scheduleJob("*/5 * * * *", async () => {

    const redis = await writeRedis.syncData();

    logger.info(redis);
});


// Root health endpoint
app.get("/", async (c) => {
    c.status(200);
    return c.json({ message: "hello from server" });
});


// Register API routes and static file server
app.route("/article", index)
    .route("/category", category)
    .route('/' , admin)

    // Serve static files from /public directory
    .use(
        "/static/*",
        serveStatic({
            root: "./public",
            rewriteRequestPath: (path) => path.replace(/^\/static/, ""),
        }),
    );


// Global error handler
app.onError(async (error: any, c) => {

    // Log error with request metadata
    logger.error(
        {
            path: c.req.path,
            method: c.req.method,
            status: error.status || 500,
            stack: Number(error.status) == 500 ? error.stack : "validate error",
        },
        error.message,
    );

    // Set CORS header for error responses
    c.res.headers.set(
        "Access-Control-Allow-Origin",
        process.env["FRONT_END_URL"] ?? "https://localhost:3000",
    );


    // Handle Hono HTTPException
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


    // Default error response
    c.status((Number(error.status) as StatusCode) || 500);

    return c.json({
        status: error.status || 500,
        message: error.message || "internal server error",
        error: error.error || "",
    });
});


// Start Bun server with TLS
export default {
    port: 2000,
    fetch: app.fetch,
    tls: {
        cert: Bun.file("./localhost.pem"),
        key: Bun.file("./localhost-key.pem"),
    },
};