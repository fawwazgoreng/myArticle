import AdminModel from "../../admin/admin.model";
import { adminHasUsed, monitoring } from "../../admin/admin.type";
import redis from "./redis";

const ttl = 60 * 60 * 24; // Cache expiration time (24 hours)

// Redis write service for caching and counter synchronization
export default class RedisToken {
    setToken = async (token: string, value: string, id: string) => {
        await redis.setex(`active_admin:${id}` , ttl , "true");
        return await redis.setex(`token:${token}`, ttl, value);
    };
    
    checkAdminActive = async (id: string , monitor: adminHasUsed ) => {
        const admin = await redis.get(`active_admin:${id}`);
        if (!admin) return true;
        const monitoring: monitoring = {
            admin_id: id,
            ip_address: monitor.ip_address,
            device_type: monitor.device_type,
            success: false,
            event_type: monitor.event_type,
            failure_session: "admin has logged in another device"
        };
        new AdminModel().monitoring(monitoring);
        throw {
            status: 401,
            message: "admin has logged in another device"
        }
    }

    getToken = async (token: string) => {
        const res = await redis.get(`token:${token}`);
        if (res) return res;
        throw {
            status: 401,
            message: "cookie expired please login first",
        };
    };
    
    deleteToken = async (token: string , id: string) => {
        await redis.del(`active_admin:${id}`);
        return await redis.del(`token:${token}`);
    }
}
