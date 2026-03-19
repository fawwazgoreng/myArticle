import RedisToken from "../infrastructure/redis/refreshToken";
import { decryptToken } from "../utils/encrypt";

export default class AdminRead {
    constructor(private redisToken = new RedisToken()) { }
    profile = async (refreshToken: string) => {
        try {
            const hashed = await this.redisToken.getToken(refreshToken);
            return await decryptToken(hashed);
        } catch (error: any) {
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    }
}