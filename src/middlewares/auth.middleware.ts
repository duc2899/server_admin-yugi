import type { Response, NextFunction, Request } from "express";

import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes.";
import { TokenBlacklistService } from "../services/tokenBlacklist.service";
import { verifyToken } from "../services/auth.service";
import { RedisService } from "../services/redis.service";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: string | undefined;

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
            return throwError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
        }

        const decoded = verifyToken(token);

        const validToken = await RedisService.get(`user_session:${decoded._id}`);
        if (token !== validToken) {
            return throwError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
        } 
        const isBlocked = await TokenBlacklistService.isBlacklisted(token);
        if (isBlocked) {
            return throwError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
        }

        req.user = decoded;
        next();
    } catch (error) {
        next(throwError("Invalid or expired token", STATUS_CODES.UNAUTHORIZED));
    }
};

export default authMiddleware;