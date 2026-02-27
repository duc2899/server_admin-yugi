import { PaginationOptions } from "../@types/common";
import Account from "../models/account";

const getAllAccounts = async ({ page = 1, limit = 10 }: PaginationOptions) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Account.find()
            .sort({ createdTime: -1 })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        Account.countDocuments()
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export { getAllAccounts };