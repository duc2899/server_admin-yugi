import crypto from "crypto";
import redisClient from "../configs/redis";

export class TokenBlacklistService {
    static hashToken(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    static async blacklistToken(token: string, ttlSeconds: number) {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;

        await redisClient.setEx(key, ttlSeconds, "1");
    }

    static async isBlacklisted(token: string): Promise<boolean> {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;

        const value = await redisClient.get(key);
        return value === "1";
    }
}