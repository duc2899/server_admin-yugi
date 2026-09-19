import type { Response, NextFunction, Request } from "express";
import { createDeckSchema, deleteDeckSchema, getDeckDetailSchema, saveDeckSchema } from "../schemas/deckAdmin.schema";
import { createDeckAdminService, deleteDeckAdminService, getAllDeckAdminService, getDeckAdminDetailService, saveDeckAdminService } from "../services/deckAdmin.service";
import { ApiResponse } from "../utils/api-response";

const createDeckController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = createDeckSchema.parse(req.body);
        const data = await createDeckAdminService(req.models.DeckAdmin, req.models.Card, paresed, req.user, {
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
        const data = await getAllDeckAdminService(req.models.DeckAdmin);
        return ApiResponse.ok(res, "Get all decks successfully", data);
    } catch (error) {
        next(error);
    }
}

const getDeckAdminDetailController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = getDeckDetailSchema.parse(req.params);
        const data = await getDeckAdminDetailService(req.models.DeckAdmin, req.models.Card, paresed);
        return ApiResponse.ok(res, "Get detail deck successfully", data);
    } catch (error) {
        next(error);
    }
}

const saveDeckController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = saveDeckSchema.parse(req.body);
        const data = await saveDeckAdminService(req.models.DeckAdmin, req.models.Card, paresed, req.user, {
            ip: req.ip,
            userAgent: req.headers["user-agent"] || "",
        });
        return ApiResponse.ok(res, "Save deck successfully", data);
    } catch (error) {
        next(error);
    }
}

const deleteDeckAdminController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paresed = deleteDeckSchema.parse(req.body);
        await deleteDeckAdminService(req.models.DeckAdmin, paresed);
        return ApiResponse.ok(res, "Delete deck successfully", null);
    } catch (error) {
        next(error);
    }
}

export { createDeckController, getAllDeckController, getDeckAdminDetailController, saveDeckController, deleteDeckAdminController }