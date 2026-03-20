import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import {jwt, sign} from "hono/jwt"
import { ContentfulStatusCode } from "hono/utils/http-status";
import { SignatureKey } from "hono/utils/jwt/jws";
import { adminHasUsed, adminType } from "../admin/admin.type";
import { getConnInfo } from "hono/bun";
import { encode } from "./encrypt";
import { JWTPayload } from "hono/utils/jwt/types";
const key = String(process.env['SECRET_KEY']);

export const checkToken = async (c : Context , next: Next) => {
    try {
        const jwtMiddleware = jwt({
            secret: (String(process.env["SECRET_TOKEN"])) as SignatureKey,
            alg: "HS256"
        })
        await jwtMiddleware(c , next);
    } catch (error) {
        const res = c.json({
            status: 401,
            message: 'unauthorized',
        });
        throw new HTTPException(res.status as ContentfulStatusCode, { res });
    }
}

export const hashPassword = async (password: string) => {
    return await Bun.password.hash(password);
}

export const verifyHash = async (hashed: string , password: string) => {
    const isMatch = await Bun.password.verify(password, hashed);
    if (isMatch) return;
    throw {
        status: 422,
        message: "email or password wrong"
    }
}

export const getUserHasUsed = async (c: Context , event_type : "login" | "logout" | "register") => {
    const info = getConnInfo(c);
    const userAgent = c.req.header("User-Agent");
    const res : adminHasUsed = {
        ip_address: info.remote.address || "anonymous",
        device_type: userAgent || "Mobile",
        event_type
    };
    return res;
} 

export const signToken = async (admin: adminType) => {
    // const hashedKey = await crypto.subtle.digest("SHA-256", encode(key));
    const payload = {
        username: admin.username,
        role: "admin",
        exp: Math.floor((Date.now() / 1000) * 60 * 15),
        email: admin.email,
        id: admin.id
    }
    return await sign(payload , key , "HS256"); 
}