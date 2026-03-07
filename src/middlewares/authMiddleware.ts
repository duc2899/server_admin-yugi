import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import throwError from "../utils/throwError";
import { ENV } from "../config/env";
import { AppRequest, JwtPayload } from "../types/common";


const authMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return throwError("Authorization header missing", 401);
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (err) {
        return throwError("Invalid or expired token", 401);
    }
};

export default authMiddleware;