import { Context } from "hono";
import { getCookie } from "hono/cookie";
import RedisToken from "../infrastructure/redis/refreshToken";

export default class AdminRead {
    constructor(private redisToken = new RedisToken()) { }
    profile = async (c: Context) => {
        try {
            const refreshToken = getCookie(c, 'refresh-token');
            if (!refreshToken) {
                throw {
                    status: 401,
                    message: "unauthorized",
                }
            }
            const hashed = await this.redisToken.getToken(refreshToken);
            const profile = Bun.hash()
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
}