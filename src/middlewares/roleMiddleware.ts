import type { Response, NextFunction, Request } from "express"
import { RoleAdmin } from "../models/accountAdmin"
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes.";

const roleMiddleware = (...roles: RoleAdmin[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return throwError("Access denied", STATUS_CODES.FORBIDDEN);
        }
        next()
    }
}

export default roleMiddleware;