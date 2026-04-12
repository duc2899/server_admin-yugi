import { RedisService } from "./redis.service";

export class CacheService {
    static buildKey(prefix: string, key: string) {
        return `${prefix}:${key}`;
    }

    static async getJSON<T>(key: string): Promise<T | null> {
        const data = await RedisService.get(key);
        return data ? (JSON.parse(data) as T) : null;
    }

    static async setJSON(key: string, value: any, ttlSeconds: number) {
        return RedisService.set(key, JSON.stringify(value), ttlSeconds);
    }

    // Tag system:
    // Mỗi tag sẽ chứa list keys thuộc tag đó
    static async addKeyToTag(tag: string, key: string) {
        const tagKey = `tag:${tag}`;
        await RedisService.set(tagKey, JSON.stringify([key])); // fallback nếu tag chưa tồn tại

        const current = await this.getJSON<string[]>(tagKey);
        const set = new Set(current || []);
        set.add(key);

        await RedisService.set(tagKey, JSON.stringify([...set]));
    }

    static async clearTag(tag: string) {
        const tagKey = `tag:${tag}`;
        const keys = await this.getJSON<string[]>(tagKey);

        if (keys && keys.length > 0) {
            await RedisService.delMany(keys);
        }

        await RedisService.del(tagKey);
    }
}