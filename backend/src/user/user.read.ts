import RedisToken from "../infrastructure/redis/refreshToken";
import { decryptToken } from "../utils/encrypt";

// AdminRead service responsible for retrieving administrative session data
export default class AdminRead {
    // Initialize with RedisToken dependency for session management
    constructor(private redisToken = new RedisToken()) {}

    // Retrieve and decrypt admin profile data using a refresh token
    profile = async (refreshToken: string) => {
        try {
            // Fetch the encrypted/hashed token data from the Redis store
            const hashed = await this.redisToken.getToken(refreshToken);

            // Decrypt the stored token to extract the original profile information
            return JSON.parse(await decryptToken(hashed)) as {
                id: string,
                created_at:Date
            };
        } catch (error: any) {
            // Standardize error response based on caught exception or fallback to 500
            throw {
                status: error.status || 500,
                message: error.message || "internal server erorr",
                error: error.error || "internal server error",
            };
        }
    };
}
