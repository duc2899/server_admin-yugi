import { requestSetVersionClient } from './../types/admin';
import AccountAdmin from "../models/accountAdmin";
import Config from "../models/config";
import { requestChangeRole } from "../types/admin";
import { PaginationOptions } from "../types/common";
import throwError from "../utils/throwError";

const changeRoleService = async ({ role, _id }: requestChangeRole) => {
    try {
        const user = await AccountAdmin.findOneAndUpdate({ _id: _id }, { role: role }, { new: true, runValidators: true })
        if (!user) {
            return throwError("User not found", 404);
        }
        return {
            _id: user._id,
            role: user.role
        }
    } catch (error: any) {
        throw error;
    }
}

const getAllAccountsService = async ({ page = 1, limit = 10 }: PaginationOptions) => {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        AccountAdmin.find()
            .sort({ createdTime: -1 })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        AccountAdmin.countDocuments()
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

const getVersionClientService = async () => {
    const config = await Config.findOne({ _id: "CLIENT_VERSION" }).lean();
    if (!config) {
        return throwError("Not found config", 400);
    }

    return config.data;
}

const setVersionClientService = async ({ version }: requestSetVersionClient) => {
    const config = await Config.findOneAndUpdate(
        { _id: "CLIENT_VERSION" },
        { data: { version } },
        { new: true }
    );

    if (!config) {
        return throwError("Not found config", 400);
    }

    return config;
};

export { changeRoleService, getAllAccountsService, getVersionClientService, setVersionClientService }