import type { Response, NextFunction } from "express";

import { getAllCards, searchCards } from "../services/card.service";
import { paginationSchema } from "../schemas/paginationSchema";
import { searchCardSchema } from "../schemas/cardSchema";
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
export { getAllCardsController, searchCardsController };