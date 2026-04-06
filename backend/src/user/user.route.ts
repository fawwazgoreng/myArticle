import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { encryptToken, randomUuid } from "../utils/auth/encrypt";
import AdminModel from "./user.model";
import { userType, monitoring } from "./user.type";
import { getConnInfo } from "hono/bun";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { ttl } from "../infrastructure/redis/redis.write";
import RedisToken from "../infrastructure/redis/refreshToken";
import { checkToken, getUserHasUsed, signToken } from "../utils/auth/jwtauth";
import { decryptCookie } from "../utils/auth/decryptUserToken";
import UserWrite from "./user.write";
import { env } from "../config";

// Create Hono app instance for user-related routing
const app = new Hono();

// Initialize internal services and database models
const userWrite = new UserWrite();
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
            const user = await userWrite.login(request);
            
            // Prepare encrypted session data for the refresh token
            const encryptionData = {
                id: user.id,
                created_at: new Date(),
                roles: user.roles
            };
            
            const value = await encryptToken(JSON.stringify(encryptionData));
            const setTokenCookie = await encryptToken(JSON.stringify(user));
            const token = await randomUuid();
            const dateExp = new Date();

            // Store session token in Redis with defined Time-To-Live
            await redisToken.setToken(token, value, user.id, setTokenCookie);
            dateExp.setDate(dateExp.getTime() + ttl);
            
            c.status(200);
            
            // Refresh the client-side refresh-token cookie (HttpOnly for security)
            deleteCookie(c, "refresh-token");
            setCookie(c, "refresh-token", token, {
                path: "/",
                secure: true,
                domain: env.FRONT_END_URL,
                expires: dateExp,
                maxAge: 7,
                sameSite: "Strict",
                httpOnly: true,
            });

            // Log successful login event to audit trail
            const monitoring: monitoring = {
                admin_id: user.id,
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
                token
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
            const profile = await decryptCookie(c);
            
            // Generate a fresh short-lived JWT for frontend authentication
            const token = await signToken(profile as userType);

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
            const roles = String(request.roles) == "writer" ? "writer" : "user";
            await userWrite.register({...request, roles}); 
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
            const user = await userWrite.logout(refreshToken);
            // Clear the browser cookie
            deleteCookie(c, "refresh-token");

            // Audit the logout event
            const monitoring: monitoring = {
                admin_id: user.id,
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