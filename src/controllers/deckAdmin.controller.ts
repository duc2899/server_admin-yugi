import type { Response, NextFunction } from "express";
import { AppRequest } from "../types/common";
import { createDeckSchema } from "../schemas/deckAdmin.schema";
import { createDeckAdminService } from "../services/deckAdmin.service";
import { ApiResponse } from "../utils/api-response";

const createDeckController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const paresed = createDeckSchema.parse(req.body);
        const data = await createDeckAdminService(paresed);
        return ApiResponse.ok(res, "Create a deck successfully", data);
    } catch (error) {
        next(error);
    }
}

export { createDeckController }