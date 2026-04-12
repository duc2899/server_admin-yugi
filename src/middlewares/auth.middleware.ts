import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import throwError from "../utils/throwError";
import { AppRequest, JwtPayload } from "../types/common";
import { STATUS_CODES } from "../constants/status-codes.";
import env from "../configs/env";
import { TokenBlacklistService } from "../services/tokenBlacklist.service";

const authMiddleware = async (req: AppRequest, res: Response, next: NextFunction) => {
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

        const isBlocked = await TokenBlacklistService.isBlacklisted(token);
        if (isBlocked) {
            return throwError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
        }

        const decoded = jwt.verify(
            token,
            env.JWT_ACCESS_SECRET as string
        ) as JwtPayload;

        req.user = decoded;
        next();
    } catch (error) {
        next(throwError("Invalid or expired token", STATUS_CODES.UNAUTHORIZED));
    }
};

export default authMiddleware;