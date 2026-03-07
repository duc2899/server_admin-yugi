import type { Response, NextFunction } from "express"
import { AppRequest } from "../types/common"
import { RoleAdmin } from "../models/accountAdmin"
import throwError from "../utils/throwError";

const roleMiddleware = (...roles: RoleAdmin[]) => {
    return (req: AppRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return throwError("Access denied", 403);
        }
        next()
    }
}

export default roleMiddleware;