import { Context } from "hono";
import { getCookie } from "hono/cookie";
import RedisToken from "../../infrastructure/redis/refreshToken";
import UserWrite from "../../user/user.write";
import UserRead from "../../user/user.read";

export const decryptCookie = async (c: Context) => {
    const refreshToken = String(getCookie(c, "refresh-token"));
    if (!refreshToken) {
        throw { status: 401, message: "unauthorized" };
    }

    // Decrypt and parse the stored session payload
    const hashed: {
        id: string;
        created_at: Date;
        roles: string;
    } = await new UserRead().profile(refreshToken);

    const newDate = new Date();
    const now = newDate.getTime();
    const time = new Date(hashed.created_at).getTime();
    let profile = hashed;
    const oneDay = 1000 * 60 * 60 * 24;
    let isRefresh = false;

    // Logic: Check if cache is still valid (under 24 hours)
    if (now - time < oneDay) {                
        const res = await new RedisToken().findToken(profile.id);
        if (!res) {
            isRefresh = true; // Cache missing, force re-sync
        } else {    
            profile = res;
        }
    } else {
        isRefresh = true; // Token older than 24 hours, force re-sync from DB
    }
    
    // Re-sync with primary Database if cache is stale or missing
    if (isRefresh) {
        const res = await new UserWrite().refreshData(hashed.id);
        profile = {
            created_at: newDate,
            ...res
        }
    }
    return profile;
}