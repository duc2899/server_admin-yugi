import type { Request, Response, NextFunction } from "express";

import { getAllAccounts } from "../services/accountService";
import { paginationSchema } from "../schemas/paginationSchema";

const fetchAllAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = paginationSchema.parse(req.query);
        const data = await getAllAccounts(parsed);
        res.status(200).json({ status: true, data, message: "Accounts fetched successfully" });
    } catch (error) {
        next(error);
    }
};

export { fetchAllAccounts };