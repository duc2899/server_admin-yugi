"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_service_1 = require("./redis.service");
class TokenBlacklistService {
    static hashToken(token) {
        return crypto_1.default.createHash("sha256").update(token).digest("hex");
    }
    static async blacklistToken(token, ttlSeconds) {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;
        await redis_service_1.RedisService.set(key, "1", ttlSeconds);
    }
    static async isBlacklisted(token) {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;
        const value = await redis_service_1.RedisService.get(key);
        return value === "1";
    }
}
exports.TokenBlacklistService = TokenBlacklistService;
