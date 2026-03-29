import type { Response, NextFunction } from "express";
import { changeRoleService, getAllAccountsService, getVersionClientService, setVersionClientService, toggleBanUserService } from "../services/admin.service";
import { changeRoleSchema, setVersionClientSchema, toggleBanSchema } from "../schemas/adminSchema";
import { AppRequest } from "../types/common";
import { ApiResponse } from "../utils/api-response";
import { getAccountsSchema } from "../schemas/accountSchema";

const changeRoleController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = changeRoleSchema.parse(req.body);
        const result = await changeRoleService(parsed);
        return ApiResponse.ok(res, "Change role successful", result)
    } catch (error) {
        next(error);
    }
};

const getAllAccountsController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = getAccountsSchema.parse(req.query);
        const data = await getAllAccountsService(parsed);
        return ApiResponse.ok(res, "Accounts fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

const getVersionClientController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getVersionClientService();
        return ApiResponse.ok(res, "Get version successfully", data)
    } catch (error) {
        next(error);
    }
};

const setVersionClientController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = setVersionClientSchema.parse(req.body);
        const data = await setVersionClientService(parsed);
        return ApiResponse.ok(res, "Set version successfully", data)
    } catch (error) {
        next(error);
    }
};

const toggleBanUserController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = toggleBanSchema.parse(req.body);
        const data = await toggleBanUserService(parsed);
        return ApiResponse.ok(res, "Toggle ban successfully", data)
    } catch (error) {
        next(error);
    }
};

export { changeRoleController, getAllAccountsController, getVersionClientController, setVersionClientController, toggleBanUserController }