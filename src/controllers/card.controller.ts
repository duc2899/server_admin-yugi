import type { Response, NextFunction } from "express";

import { getAllCards, searchCards, setStatusCardService } from "../services/card.service";
import { paginationSchema } from "../schemas/paginationSchema";
import { searchCardSchema, setCardStatusSchema } from "../schemas/cardSchema";
import { AppRequest } from "../types/common";
import { ApiResponse } from "../utils/api-response";

const getAllCardsController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = paginationSchema.parse(req.query);
        const data = await getAllCards(parsed);
        return ApiResponse.ok(res, "Cards fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

const searchCardsController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = searchCardSchema.parse(req.query);
        const data = await searchCards(parsed);
        return ApiResponse.ok(res, "Cards fetched successfully", data)
    } catch (error) {
        next(error);
    }
}

const setCardStatusController = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = setCardStatusSchema.parse(req.body);
        const data = await setStatusCardService(parsed);
        return ApiResponse.ok(res, "Card status updated successfully", data)
    } catch (error) {
        next(error);
    }
}

export { getAllCardsController, searchCardsController, setCardStatusController };