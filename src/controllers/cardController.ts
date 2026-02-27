import type { Request, Response, NextFunction } from "express";

import { getAllCards, searchCards } from "../services/cardService";
import { paginationSchema } from "../schemas/paginationSchema";
import { searchCardSchema } from "../schemas/cardSchema";

const fetchAllCards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = paginationSchema.parse(req.query);
        const data = await getAllCards(parsed);
        res.status(200).json({ status: true, data, message: "Cards fetched successfully" });
    } catch (error) {
        next(error);
    }
};
const searchCardsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = searchCardSchema.parse(req.query);
        const data = await searchCards(parsed);
        res.status(200).json({ status: true, data, message: "Cards fetched successfully" });
    } catch (error) {
        next(error);
    }
}
export { fetchAllCards, searchCardsController };