import Account from "../models/account";
import { GetAccountsOptions } from "../types/account";

const getAllAccounts = async (options: GetAccountsOptions) => {
    const { page = 1, limit = 10, key } = options;
    const skip = (page - 1) * limit;

    const query: any = {};
    console.log("key:", key);
    if (key?.trim()) {
        const k = key.trim();

        query.$or = [
            { displayName: { $regex: k, $options: "i" } },
            { email: { $regex: k, $options: "i" } },
            { code: { $regex: k, $options: "i" } },
        ];
    }

    const [data, total] = await Promise.all([
        Account.find(query)
            .sort({ createdTime: -1 })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        Account.countDocuments(query)
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