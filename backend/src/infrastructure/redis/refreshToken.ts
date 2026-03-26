import { ca } from "zod/v4/locales";
import redis from "./redis";

const ttl = 60 * 60 * 24; // Cache expiration time (24 hours)

// Redis write service for caching and counter synchronization
export default class RedisToken {
    setToken = async (
        token: string,
        value: string,
        id: string,
        data: string,
    ) => {
        await redis.setex(`admin:${id}`, ttl, data);
        return await redis.setex(`refresh_token:${token}`, ttl, value);
    };
    
    findToken = async (id: string) => {
        try {
            const res = await redis.get(`admin:${id}`);
            if (!res) return false;
            return JSON.parse(res) as {
                id: string,
                created_at: Date,
                username: string,
                email: string,
                roles: string
            }
        } catch (error) {
            return false;
        }
    }

    getToken = async (token: string) => {
        const res = await redis.get(`refresh_token:${token}`);
        if (res) return res;
        throw {
            status: 401,
            message: "cookie expired please login first",
        };
    };

    deleteToken = async (token: string, id: string) => {
        await redis.del(`admin:${id}`);
        return await redis.del(`refresh_token:${token}`);
    };

    refreshData = async (id: string, data: string) => {
        await redis.setex(`admin:${id}`, ttl, data);
    };
}
