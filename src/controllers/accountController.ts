import type { Response, NextFunction } from "express";

import { getAllAccounts } from "../services/accountService";
import { AppRequest } from "../types/common";
import { getAccountsSchema } from "../schemas/accountSchema";

const fetchAllAccounts = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = getAccountsSchema.parse(req.query);
        const data = await getAllAccounts(parsed);
        res.status(200).json({ status: true, data, message: "Accounts fetched successfully" });
    } catch (error) {
        next(error);
    }
};

export { fetchAllAccounts };