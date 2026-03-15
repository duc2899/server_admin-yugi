import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import throwError from "../utils/throwError";
import { AppRequest, JwtPayload } from "../types/common";
import { STATUS_CODES } from "../constants/status-codes.";
import env from "../configs/env";

const authMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1️⃣ lấy từ Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }

    // 2️⃣ nếu không có thì lấy từ cookie
    if (!token) {
        token = req.cookies?.access_token;
    }

    if (!token) {
        return throwError("Unauthorized", STATUS_CODES.UNAUTHORIZED);
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        return throwError("Invalid or expired token", 401);
    }
};

export default authMiddleware