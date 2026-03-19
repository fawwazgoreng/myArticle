import redis from "./redis";

const ttl = 60 * 60 * 24; // Cache expiration time (24 hours)

// Redis write service for caching and counter synchronization
export default class RedisToken {
    setToken = async (token: string, value: string) => {
        return await redis.setex(`token:${token}`, ttl, value);
    };

    getToken = async (token: string) => {
        const res = await redis.get(`token:${token}`);
        if (res) return res;
        throw {
            status: 401,
            message: "cookie expired please login first",
        };
    };
    
    deleteToken = async (token: string) => {
        return await redis.del(`token${token}`);
    }
}
