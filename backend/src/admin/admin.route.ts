import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import AdminWrite from "./admin.write";
import AdminRead from "./admin.read";
import { encryptToken, randomUuid } from "../utils/encrypt";
import AdminModel from "./admin.model";
import { monitoring } from "./admin.type";
import { getConnInfo } from "hono/bun";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { ttl } from "../infrastructure/redis/redis.write";
import RedisToken from "../infrastructure/redis/refreshToken";
import { getUserHasUsed } from "../utils/jwtauth";

// Create Hono app instance for admin-related routing
const app = new Hono();

// Initialize internal services and database models
const adminWrite = new AdminWrite();
const adminRead = new AdminRead();
const adminModel = new AdminModel();
const redisToken = new RedisToken();

app
    // POST /login
    // Authenticate admin and establish a secure session via HttpOnly cookies and Redis
    .post("login", async (c) => {
        try {
            // Retrieve connection and device information for auditing
            const info = await getUserHasUsed(c, "login");
            const request = await c.req.json();
            
            // Validate credentials and retrieve admin profile
            const admin = await adminWrite.login(request);
            
            // Prepare encrypted session data
            const encryptionData = {
                id: admin.id,
                created_at: new Date(),
            };
            
            const value = await encryptToken(JSON.stringify(encryptionData));
            const setTokenCookie = await encryptToken(JSON.stringify(admin));
            const token = await randomUuid();
            const dateExp = new Date();

            // Store session token in Redis with defined Time-To-Live
            await redisToken.setToken(token, value, admin.id, setTokenCookie);
            dateExp.setDate(dateExp.getSeconds() + ttl);
            
            c.status(200);
            
            // Refresh the client-side refresh-token cookie
            deleteCookie(c, "refresh-token");
            setCookie(c, "refresh-token", token, {
                path: "/",
                secure: true,
                domain: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
                expires: dateExp,
                maxAge: ttl,
                sameSite: "Strict",
                httpOnly: true,
            });

            // Log successful login event to audit trail
            const monitoring: monitoring = {
                admin_id: admin.id,
                ip_address: info.ip_address,
                device_type: info.device_type,
                event_type: info.event_type,
                failure_session: null,
                success: true,
            };
            adminModel.monitoring(monitoring);

            return c.json({
                status: 200,
                message: "login successfully",
            });
        } catch (error: any) {
            // Map internal errors to HTTP Exceptions
            const res = {
                status: error.status,
                message: error.message,
                error: error.error,
            };
            throw new HTTPException(res.status, res);
        }
    })

    // GET /profile
    // Retrieve current admin session info and refresh stale session data if necessary
    .get("/profile", async (c) => {
        try {
            // Extract session token from cookies
            const refreshToken = getCookie(c, "refresh-token");
            if (!refreshToken) {
                throw {
                    status: 401,
                    message: "unauthorized",
                };
            }

            // Decrypt and parse stored session data
            const hashed: {
                id: string;
                created_at: Date;
            } = JSON.parse(await adminRead.profile(refreshToken));

            const newDate = new Date();
            const now = newDate.getTime();
            const time = new Date(hashed.created_at).getTime(); // Ensure Date object
            let profile = hashed;
            const oneDay = 1000 * 60 * 60 * 24;

            // If session data is older than 24 hours, re-sync with primary database
            if (now - time > oneDay) {                
                const res = await adminWrite.refreshData(hashed.id);
                profile = {
                    created_at: newDate,
                    ...res
                }
            }

            return c.json({
                status: 200,
                message: "success get profile",
                profile,
            });
        } catch (error: any) {
            const res = {
                status: error.status,
                message: error.message,
                error: error.error,
            };
            throw new HTTPException(res.status, res);
        }
    })

    // DELETE /logout
    // Invalidate session, clear cookies, and log the sign-out event
    .delete("/logout", async (c) => {
        try {
            const info = getConnInfo(c);
            const userAgent = c.req.header("User-Agent");
            const refreshToken = getCookie(c, "refresh-token");

            if (!refreshToken) {
                throw {
                    status: 401,
                    message: "unauthorized",
                };
            }

            // Remove token from Redis and clear cookie
            const admin = await adminWrite.logout(refreshToken);
            deleteCookie(c, "refresh-token");

            // Record logout event for security monitoring
            const monitoring: monitoring = {
                admin_id: admin.id,
                ip_address: info.remote.address || "anonymous",
                device_type: userAgent || "mobile",
                event_type: "logout",
                failure_session: null,
                success: true,
            };
            adminModel.monitoring(monitoring);

            return c.json({
                status: 200,
                message: "logout successfully",
            });
        } catch (error: any) {
            const res = {
                status: error.status,
                message: error.message,
                error: error.error,
            };
            throw new HTTPException(res.status, res);
        }
    });

export default app;