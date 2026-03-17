import { Context } from "hono";
import WriteRedis from "../infrastructure/redis/redis.write";
import { getCookie } from "hono/cookie";

export default class AdminWrite {
    constructor(private writeRedis = new WriteRedis()) { }
    profile = async (c: Context) => {
        try {
            const refreshToken = getCookie(c, 'refresh-token');
            
        } catch (error : any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
}