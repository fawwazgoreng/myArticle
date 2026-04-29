import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { getConnInfo, serveStatic } from "hono/bun";
import { rateLimiter } from "hono-rate-limiter";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "@/infrastructure/logger/log";
import category from "@/category/category.route";
import index from "@/article/article.route";
import admin from "@/user/user.route";
import schedule from "node-schedule";
import WriteRedis from "@/infrastructure/redis/redis.write";
import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { env } from "@/config";

type Variables = {
    requestId: string;
};

// Initialize Redis writer for sync jobs
const writeRedis = new WriteRedis();

// Initialize Hono application
const app = new Hono<{ Variables: Variables }>();

// Enable CORS for frontend communication
app.use(
    "*",
    cors({
        origin: env.FRONT_END_URL,
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
        origin: env.FRONT_END_URL,
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
    c.set("requestId", requestId);
    await next();
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
    .route("/", admin)

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
    const status = error instanceof HTTPException ? error.status : 500;
    const isCritical = status >= 500;

    let errorDetails = null;
    if (error instanceof HTTPException) {
        errorDetails = await error
            .getResponse()
            .clone()
            .json()
            .catch(() => null);
    }

    const logMetadata = {
        path: c.req.path,
        method: c.req.method,
        status,
        errorCode: errorDetails?.error || "UNKNOWN_CODE",
        details: errorDetails?.details,
    };

    if (isCritical || logMetadata.errorCode === "DATABASE_ERROR") {
        logger.architecture(error.message, {
            ...logMetadata,
            component: "INFRASTRUCTURE_FAIL",
            err: error,
        });
    } else {
        logger.error(error.message, logMetadata);
    }

    // Set CORS header for error responses
    c.res.headers.set("Access-Control-Allow-Origin", env.FRONT_END_URL);

    if (error instanceof HTTPException) {
        const errorResponse = await error
            .getResponse()
            .clone()
            .json()
            .catch(() => null);
        c.status(status as StatusCode);
        return c.json(errorResponse || { status, message: error.message });
    }

    // Default Production Response
    c.status(status as StatusCode);
    return c.json({
        status: status,
        message: isCritical ? "Internal Server Error" : error.message,
        error: process.env.NODE_ENV !== "production" ? error.stack : undefined,
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
