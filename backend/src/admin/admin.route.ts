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

const app = new Hono();
const adminWrite = new AdminWrite();
const adminRead = new AdminRead();
const adminModel = new AdminModel();
const redisToken = new RedisToken();

app.post("login", async (c) => {
    try {
        const info = await getUserHasUsed(c , "login");
        const request = await c.req.json();
        const admin = await adminWrite.login(request);
        await redisToken.checkAdminActive(admin.id , info);
        const value = await encryptToken(JSON.stringify(admin));
        const token = await randomUuid();
        const dateExp = new Date();
        await redisToken.setToken(token , value , admin.id);
        dateExp.setDate(dateExp.getSeconds() + ttl);
        const monitoring: monitoring = {
            admin_id: admin.id,
            ip_address: info.ip_address,
            device_type: info.device_type,
            event_type: info.event_type,
            failure_session: null,
            success: true,
        };
        adminModel.monitoring(monitoring);
        c.status(200);
        setCookie(c, "refresh-token", token, {
            path: "/",
            secure: true,
            domain: process.env["FRONT_END_URL"] ?? "https://localhost:3000",
            expires: dateExp,
            maxAge: ttl,
            sameSite: "Strict",
            httpOnly: true,
        });
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
}).get("/profile", async (c) => {
    try {
        const refreshToken = getCookie(c, 'refresh-token');
        if (!refreshToken) {
            throw {
                status: 401,
                message: "unauthorized",
            }
        }
        const profile = await adminRead.profile(refreshToken);
        c.json(200);
        return c.json({
            status: 200,
            message: "success get profile",
            profile
        })
    } catch (error: any) {
        const res = {
            status: error.status,
            message: error.message,
            error: error.error,
        };
        throw new HTTPException(res.status, res);
    }
}).delete("/logout", async (c) => {
    try {
        const info = getConnInfo(c);
        const userAgent = c.req.header("User-Agent");
        const refreshToken = getCookie(c, 'refresh-token');
        if (!refreshToken) {
            throw {
                status: 401,
                message: "unauthorized",
            }
        }
        const admin = await adminWrite.logout(refreshToken);
        deleteCookie(c, 'refresh-token');
        const monitoring: monitoring = {
            admin_id: admin.id,
            ip_address: info.remote.address || "anonymous",
            device_type: userAgent || "mobile",
            event_type: "logout",
            failure_session: null,
            success: true,
        };
        adminModel.monitoring(monitoring);
        c.json({
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
