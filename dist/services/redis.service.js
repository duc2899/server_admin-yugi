"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const redis_1 = __importDefault(require("../configs/redis"));
class RedisService {
    static async get(key) {
        return redis_1.default.get(key);
    }
    static async set(key, value, ttlSeconds) {
        if (ttlSeconds) {
            return redis_1.default.setEx(key, ttlSeconds, value);
        }
        return redis_1.default.set(key, value);
    }
    static async del(key) {
        return redis_1.default.del(key);
    }
    static async delMany(keys) {
        if (keys.length === 0)
            return;
        return redis_1.default.del(keys);
    }
    static async keys(pattern) {
        return redis_1.default.keys(pattern);
    }
}
exports.RedisService = RedisService;
