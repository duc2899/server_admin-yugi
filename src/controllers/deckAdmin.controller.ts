import type { Response, NextFunction, Request } from "express";
import { createDeckSchema, getDeckDetailSchema, saveDeckSchema } from "../schemas/deckAdmin.schema";
import { createDeckAdminService, getAllDeckAdminService, getDeckAdminDetailService, saveDeckAdminService } from "../services/deckAdmin.service";
import { ApiResponse } from "../utils/api-response";

const createDeckController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = createDeckSchema.parse(req.body);
        const data = await createDeckAdminService(paresed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return ApiResponse.created(res, "Create a deck successfully", data);
    } catch (error) {
        next(error);
    }
}

const getAllDeckController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await getAllDeckAdminService();
        return ApiResponse.ok(res, "Get all decks successfully", data);
    } catch (error) {
        next(error);
    }
}

const getDeckAdminDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = getDeckDetailSchema.parse(req.params);
        const data = await getDeckAdminDetailService(paresed);
        return ApiResponse.ok(res, "Get detail deck successfully", data);
    } catch (error) {
        next(error);
    }
}

const saveDeckController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = saveDeckSchema.parse(req.body);
        const data = await saveDeckAdminService(paresed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return ApiResponse.ok(res, "Create a deck successfully", data);
    } catch (error) {
        next(error);
    }
}



export { createDeckController, getAllDeckController, getDeckAdminDetailController, saveDeckController }