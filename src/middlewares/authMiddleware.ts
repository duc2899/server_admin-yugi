import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import throwError from "../utils/throwError";
import { ENV } from "../config/env";


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return throwError("Authorization header missing", 401);
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET_KEY as string);
        (req as any).user = decoded;
        next();
    } catch (err) {
        return throwError("Invalid or expired token", 401);
    }
};

export default authMiddleware;