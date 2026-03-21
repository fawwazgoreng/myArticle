import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import AdminWrite from "./admin.write";
import AdminRead from "./admin.read";
import { encryptToken, randomUuid } from "../utils/encrypt";
import AdminModel from "./admin.model";
import { adminType, monitoring } from "./admin.type";
import { getConnInfo } from "hono/bun";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { ttl } from "../infrastructure/redis/redis.write";
import RedisToken from "../infrastructure/redis/refreshToken";
import { checkToken, getUserHasUsed, signToken } from "../utils/jwtauth";

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
    .post("/login", async (c) => {
        try {
            // Retrieve connection and device information for auditing
            const info = await getUserHasUsed(c, "login");
            const request = await c.req.json();
            
            // Validate credentials and retrieve admin profile
            const admin = await adminWrite.login(request);
            
            // Prepare encrypted session data for the refresh token
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
            
            // Refresh the client-side refresh-token cookie (HttpOnly for security)
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
            const res = {
                status: error.status,
                message: error.message,
                error: error.error,
            };
            throw new HTTPException(res.status, res);
        }
    })

    // GET /profile
    // Validates the refresh token, synchronizes cache, and issues a fresh JWT Access Token
    .get("/profile", async (c) => {
        try {
            // Extract the session identifier from the HttpOnly cookie
            const refreshToken = getCookie(c, "refresh-token");
            if (!refreshToken) {
                throw { status: 401, message: "unauthorized" };
            }

            // Decrypt and parse the stored session payload
            const hashed: {
                id: string;
                created_at: Date;
            } = JSON.parse(await adminRead.profile(refreshToken));

            const newDate = new Date();
            const now = newDate.getTime();
            const time = new Date(hashed.created_at).getTime();
            let profile = hashed;
            const oneDay = 1000 * 60 * 60 * 24;
            let isRefresh = false;

            // Logic: Check if cache is still valid (under 24 hours)
            if (now - time < oneDay) {                
                const res = await redisToken.findToken(profile.id);
                if (!res) {
                    isRefresh = true; // Cache missing, force re-sync
                } else {
                    profile = JSON.parse(res);
                }
            } else {
                isRefresh = true; // Token older than 24 hours, force re-sync from DB
            }
            
            // Re-sync with primary Database if cache is stale or missing
            if (isRefresh) {
                const res = await adminWrite.refreshData(hashed.id);
                profile = {
                    created_at: newDate,
                    ...res
                }
            }
            
            // Generate a fresh short-lived JWT for frontend authentication
            const token = signToken(profile as adminType);

            return c.json({
                status: 200,
                message: "success get profile",
                profile,
                token: token
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
    
    // POST /register
    // Endpoint for creating new administrator accounts
    .post('/register', async (c) => {
        try {
            const request = await c.req.json();
            await adminWrite.register(request); 
            c.status(201);
            return c.json({
                status: 201,
                message: "success created admin",
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

    // Secure the logout route using JWT verification middleware
    .use('/logout', checkToken)
    
    // DELETE /logout
    // Terminate session by clearing Redis entries and client-side cookies
    .delete("/logout", async (c) => {
        try {
            const info = getConnInfo(c);
            const userAgent = c.req.header("User-Agent");
            const refreshToken = getCookie(c, "refresh-token");

            if (!refreshToken) {
                throw { status: 401, message: "unauthorized" };
            }

            // Invalidate session in Redis
            const admin = await adminWrite.logout(refreshToken);
            // Clear the browser cookie
            deleteCookie(c, "refresh-token");

            // Audit the logout event
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