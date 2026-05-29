"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_service_1 = require("./redis.service");
class CacheService {
    static buildKey(prefix, key) {
        return `${prefix}:${key}`;
    }
    static async getJSON(key) {
        const data = await redis_service_1.RedisService.get(key);
        return data ? JSON.parse(data) : null;
    }
    static async setJSON(key, value, ttlSeconds) {
        return redis_service_1.RedisService.set(key, JSON.stringify(value), ttlSeconds);
    }
    // Tag system:
    // Mỗi tag sẽ chứa list keys thuộc tag đó
    static async addKeyToTag(tag, key) {
        const tagKey = `tag:${tag}`;
        await redis_service_1.RedisService.set(tagKey, JSON.stringify([key])); // fallback nếu tag chưa tồn tại
        const current = await this.getJSON(tagKey);
        const set = new Set(current || []);
        set.add(key);
        await redis_service_1.RedisService.set(tagKey, JSON.stringify([...set]));
    }
    static async clearTag(tag) {
        const tagKey = `tag:${tag}`;
        const keys = await this.getJSON(tagKey);
        if (keys && keys.length > 0) {
            await redis_service_1.RedisService.delMany(keys);
        }
        await redis_service_1.RedisService.del(tagKey);
    }
}
exports.CacheService = CacheService;
