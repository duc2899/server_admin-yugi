import { Request, Response, NextFunction } from "express";
import { CacheService } from "../services/cache.service";
import { STATUS_CODES } from "../constants/status-codes.";

type CacheOptions = {
    ttl?: number;
    prefix?: string;
    tag?: string; // nhóm cache để clear nhanh
    skipAuth?: boolean; // nếu true thì có Authorization cũng cache
};

export const cacheMiddleware = (options?: CacheOptions) => {
    const ttl = options?.ttl ? options.ttl * 60: 300; // mặc định 5 phút
    const prefix = options?.prefix ?? "cache";
    const tag = options?.tag;
    const skipAuth = options?.skipAuth ?? false;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Skip cache nếu API có Authorization (thường là private API)
            if (!skipAuth && req.headers.authorization) {
                return next();
            }

            // Key theo URL + query
            const cacheKey = CacheService.buildKey(prefix, req.originalUrl);

            const cached = await CacheService.getJSON<any>(cacheKey);
            if (cached) {
                return res.status(STATUS_CODES.OK).json(cached);
            }

            const originalJson = res.json.bind(res);

            res.json = (body: any) => {
                // chỉ cache nếu response OK
                if (res.statusCode === STATUS_CODES.OK) {
                    CacheService.setJSON(cacheKey, body, ttl).catch(console.error);

                    if (tag) {
                        CacheService.addKeyToTag(tag, cacheKey).catch(console.error);
                    }
                }

                return originalJson(body);
            };

            next();
        } catch (err) {
            console.error("Cache middleware error:", err);
            next();
        }
    };
};