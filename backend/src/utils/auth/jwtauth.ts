import { Context, Next } from "hono";
import { sign, verify} from "hono/jwt"
import { adminHasUsed, userType } from "@/user/user.type";
import { getConnInfo } from "hono/bun";
import { env } from "@/config";
import { toHttpException } from "@utils/error/separated";
import AppError from "@utils/error";
const key = String(env.SECRET_KEY);

export const checkToken = async (c : Context , next: Next) => {
    try {
        const token = c.req.header("Authorization")?.split("Bearer ")[1].trim();
        await verify(String(token), key, "HS256");
        await next();
    } catch (error : any) {
        throw toHttpException(new AppError(401, "unauthorized" , "UNAUTHORIZED"));
    }
}

export const hashPassword = async (password: string) => {
    return await Bun.password.hash(password);
}

export const verifyHash = async (hashed: string , password: string) => {
    const isMatch = await Bun.password.verify(password, hashed);
    if (isMatch) return;
    throw new AppError(422, "email or password wrong");
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

export const signToken = async (admin: userType) => {
    // const hashedKey = await crypto.subtle.digest("SHA-256", encode(key));
    const payload = {
        username: admin.username,
        role: admin.roles,
        exp: Math.floor((Date.now() / 1000) * 60 * 15),
        email: admin.email,
        id: admin.id
    }
    return await sign(payload , key , "HS256"); 
}