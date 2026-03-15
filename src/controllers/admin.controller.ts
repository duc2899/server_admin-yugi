import type { Response, NextFunction } from "express";
import { changeRoleService, getAllAccountsService, getVersionClientService, setVersionClientService } from "../services/admin.service";
import { changeRoleSchema, setVersionClientSchema } from "../schemas/adminSchema";
import { AppRequest } from "../types/common";
import { paginationSchema } from "../schemas/paginationSchema";
import { ApiResponse } from "../utils/api-response";

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
        const parsed = paginationSchema.parse(req.query);
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

export { changeRoleController, getAllAccountsController, getVersionClientController, setVersionClientController }