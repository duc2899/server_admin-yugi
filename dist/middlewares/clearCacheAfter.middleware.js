"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCacheAfterSuccess = void 0;
const cache_service_1 = require("../services/cache.service");
const status_codes_1 = require("../constants/status-codes.");
const clearCacheAfterSuccess = (tag) => {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // chỉ clear nếu status OK
            if (res.statusCode >= status_codes_1.STATUS_CODES.OK && res.statusCode < 300) {
                cache_service_1.CacheService.clearTag(tag).catch(console.error);
            }
            return originalJson(body);
        };
        next();
    };
};
exports.clearCacheAfterSuccess = clearCacheAfterSuccess;
