"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const throwError_1 = __importDefault(require("../utils/throwError"));
const status_codes_1 = require("../constants/status-codes");
const tokenBlacklist_service_1 = require("../services/tokenBlacklist.service");
const auth_service_1 = require("../services/auth.service");
const redis_service_1 = require("../services/redis.service");
const authMiddleware = async (req, res, next) => {
    try {
        let token;
        // 1️⃣ Ưu tiên lấy từ cookie (web)
        if (req.cookies?.access_token) {
            token = req.cookies.access_token;
        }
        // 2️⃣ Nếu không có cookie thì lấy từ Authorization header (mobile)
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }
        if (!token) {
            return (0, throwError_1.default)("Unauthorized", status_codes_1.STATUS_CODES.UNAUTHORIZED);
        }
        const decoded = (0, auth_service_1.verifyToken)(token);
        const validToken = await redis_service_1.RedisService.get(`user_session:${decoded._id}`);
        if (token !== validToken) {
            return (0, throwError_1.default)("Unauthorized", status_codes_1.STATUS_CODES.UNAUTHORIZED);
        }
        const isBlocked = await tokenBlacklist_service_1.TokenBlacklistService.isBlacklisted(token);
        if (isBlocked) {
            return (0, throwError_1.default)("Unauthorized", status_codes_1.STATUS_CODES.UNAUTHORIZED);
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        next((0, throwError_1.default)("Invalid or expired token", status_codes_1.STATUS_CODES.UNAUTHORIZED));
    }
};
exports.default = authMiddleware;
