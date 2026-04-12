import redisClient from "../configs/redis";

export class RedisService {
    static async get(key: string): Promise<string | null> {
        return redisClient.get(key);
    }

    static async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds) {
            return redisClient.setEx(key, ttlSeconds, value);
        }
        return redisClient.set(key, value);
    }

    static async del(key: string) {
        return redisClient.del(key);
    }

    static async delMany(keys: string[]) {
        if (keys.length === 0) return;
        return redisClient.del(keys);
    }

    static async keys(pattern: string): Promise<string[]> {
        return redisClient.keys(pattern);
    }
}