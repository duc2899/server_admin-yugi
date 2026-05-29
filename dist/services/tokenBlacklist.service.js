"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBlacklistService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = __importDefault(require("../configs/redis"));
class TokenBlacklistService {
    static hashToken(token) {
        return crypto_1.default.createHash("sha256").update(token).digest("hex");
    }
    static async blacklistToken(token, ttlSeconds) {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;
        await redis_1.default.setEx(key, ttlSeconds, "1");
    }
    static async isBlacklisted(token) {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;
        const value = await redis_1.default.get(key);
        return value === "1";
    }
}
exports.TokenBlacklistService = TokenBlacklistService;
