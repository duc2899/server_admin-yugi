import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import throwError from "../utils/throwError";
import { ENV } from "../config/env";
import { AppRequest, JwtPayload } from "../types/common";

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
        return throwError("Unauthorized", 401);
    }

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        return throwError("Invalid or expired token", 401);
    }
};

export default authMiddleware