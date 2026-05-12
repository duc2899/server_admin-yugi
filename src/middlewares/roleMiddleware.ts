import type { Response, NextFunction, Request } from "express"
import { RoleAccount } from "../models/accountAdmin"
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes.";

const roleMiddleware = (...roles: RoleAccount[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return throwError("Access denied", STATUS_CODES.FORBIDDEN);
        }
        next()
    }
}

export default roleMiddleware;