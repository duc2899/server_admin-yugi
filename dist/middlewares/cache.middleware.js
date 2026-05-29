"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheMiddleware = void 0;
const cache_service_1 = require("../services/cache.service");
const status_codes_1 = require("../constants/status-codes.");
const cacheMiddleware = (options) => {
    const ttl = options?.ttl ? options.ttl * 60 : 300; // mặc định 5 phút
    const prefix = options?.prefix ?? "cache";
    const tag = options?.tag;
    const skipAuth = options?.skipAuth ?? false;
    return async (req, res, next) => {
        try {
            // Skip cache nếu API có Authorization (thường là private API)
            if (!skipAuth && req.headers.authorization) {
                return next();
            }
            // Key theo URL + query
            const cacheKey = cache_service_1.CacheService.buildKey(prefix, req.originalUrl);
            const cached = await cache_service_1.CacheService.getJSON(cacheKey);
            if (cached) {
                return res.status(status_codes_1.STATUS_CODES.OK).json(cached);
            }
            const originalJson = res.json.bind(res);
            res.json = (body) => {
                // chỉ cache nếu response OK
                if (res.statusCode === status_codes_1.STATUS_CODES.OK) {
                    cache_service_1.CacheService.setJSON(cacheKey, body, ttl).catch(console.error);
                    if (tag) {
                        cache_service_1.CacheService.addKeyToTag(tag, cacheKey).catch(console.error);
                    }
                }
                return originalJson(body);
            };
            next();
        }
        catch (err) {
            console.error("Cache middleware error:", err);
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
