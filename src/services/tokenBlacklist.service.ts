import crypto from "crypto";
import { RedisService } from "./redis.service";

export class TokenBlacklistService {
    static hashToken(token: string) {
        return crypto.createHash("sha256").update(token).digest("hex");
    }

    static async blacklistToken(token: string, ttlSeconds: number) {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;

        await RedisService.set(key, "1", ttlSeconds);
    }

    static async isBlacklisted(token: string): Promise<boolean> {
        const hash = this.hashToken(token);
        const key = `bl:${hash}`;

        const value = await RedisService.get(key);
        return value === "1";
    }
}