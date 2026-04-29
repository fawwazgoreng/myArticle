import RedisToken from "@infra/redis/refreshToken";
import { decryptToken } from "@utils/auth/encrypt";

// UserRead service responsible for retrieving administrative session data
export default class UserRead {
    // Initialize with RedisToken dependency for session management
    constructor(private redisToken = new RedisToken()) {}

    // Retrieve and decrypt admin profile data using a refresh token
    profile = async (refreshToken: string) => {
        // Fetch the encrypted/hashed token data from the Redis store
        const hashed = await this.redisToken.getToken(refreshToken);

        // Decrypt the stored token to extract the original profile information
        return JSON.parse(await decryptToken(hashed)) as {
            id: string;
            created_at: Date;
            roles: string;
        };
    };
}
