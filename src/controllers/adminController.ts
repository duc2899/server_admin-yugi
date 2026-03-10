import type { Response, NextFunction } from "express";
import { changeRoleService, getAllAccountsService, getVersionClientService, setVersionClientService } from "../services/adminService";
import { changeRoleSchema, setVersionClientSchema } from "../schemas/adminSchema";
import { AppRequest } from "../types/common";
import { paginationSchema } from "../schemas/paginationSchema";

const changeRoleController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = changeRoleSchema.parse(req.body);
        const result = await changeRoleService(parsed);
        res.status(200).json({ status: true, data: result, message: "Change role successful" });
    } catch (error) {
        next(error);
    }
};

const getAllAccountsController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = paginationSchema.parse(req.query);
        const data = await getAllAccountsService(parsed);
        res.status(200).json({ status: true, data, message: "Accounts fetched successfully" });
    } catch (error) {
        next(error);
    }
};

const getVersionClientController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const data = await getVersionClientService();
        res.status(200).json({ status: true, data, message: "Get version successfully" });
    } catch (error) {
        next(error);
    }
};

const setVersionClientController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = setVersionClientSchema.parse(req.body);
        const data = await setVersionClientService(parsed);
        res.status(200).json({ status: true, data, message: "Set version successfully" });
    } catch (error) {
        next(error);
    }
};

export { changeRoleController, getAllAccountsController, getVersionClientController, setVersionClientController }