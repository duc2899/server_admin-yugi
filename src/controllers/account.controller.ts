import type { Response, NextFunction } from "express";

import { getAllAccounts } from "../services/account.service";
import { AppRequest } from "../types/common";
import { getAccountsSchema } from "../schemas/accountSchema";
import { ApiResponse } from "../utils/api-response";

const fetchAllAccounts = async (req: AppRequest, res: Response, next: NextFunction) => {
    try {
        const parsed = getAccountsSchema.parse(req.query);
        const data = await getAllAccounts(parsed);
        ApiResponse.ok(res, "Accounts fetched successfully", data)
    } catch (error) {
        next(error);
    }
};

export { fetchAllAccounts };