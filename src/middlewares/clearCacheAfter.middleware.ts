import { Request, Response, NextFunction } from "express";
import { CacheService } from "../services/cache.service";
import { STATUS_CODES } from "../constants/status-codes";

export const clearCacheAfterSuccess = (tag: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const originalJson = res.json.bind(res);

        res.json = (body: any) => {
            // chỉ clear nếu status OK
            if (res.statusCode >= STATUS_CODES.OK && res.statusCode < 300) {
                // ghép dataEnv để khớp đúng tag mà cacheMiddleware đã lưu
                const taggedKey = req.dataEnv ? `${tag}:${req.dataEnv}` : tag;
                CacheService.clearTag(taggedKey).catch(console.error);
            }

            return originalJson(body);
        };

        next();
    };
};