import type { Response, NextFunction, Request } from "express";
import { changeRoleService, getAllAccountsDetailService, getAllAccountService, getVersionClientService, setVersionClientService, toggleBanUserService } from "../services/admin.service";
import { changeRoleSchema, setVersionClientSchema, toggleBanSchema } from "../schemas/adminSchema";
import { ApiResponse } from "../utils/api-response";
import { getAccountsSchema } from "../schemas/accountSchema";

const changeRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = changeRoleSchema.parse(req.body);
        const result = await changeRoleService(parsed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return ApiResponse.ok(res, "Change role successful", result)
    } catch (error) {
        next(error);
    }
};

const getAllAccountsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllAccountService();
        return ApiResponse.ok(res, "Accounts detail fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

const getAllAccountsDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = getAccountsSchema.parse(req.query);
        const data = await getAllAccountsDetailService(parsed);
        return ApiResponse.ok(res, "Accounts detail fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

const getVersionClientController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getVersionClientService();
        return ApiResponse.ok(res, "Get version successfully", data)
    } catch (error) {
        next(error);
    }
};

const setVersionClientController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = setVersionClientSchema.parse(req.body);
        const data = await setVersionClientService(parsed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return ApiResponse.ok(res, "Set version successfully", data)
    } catch (error) {
        next(error);
    }
};

const toggleBanUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = toggleBanSchema.parse(req.body);
        const data = await toggleBanUserService(parsed, req.user);
        return ApiResponse.ok(res, "Toggle ban successfully", data)
    } catch (error) {
        next(error);
    }
};

export { changeRoleController, getAllAccountsDetailController, getVersionClientController, getAllAccountsController, setVersionClientController, toggleBanUserController }