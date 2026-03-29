import { requestSetVersionClient, requestToggleBanUser } from '../types/admin';
import AccountAdmin from "../models/accountAdmin";
import Config from "../models/config";
import { requestChangeRole } from "../types/admin";
import throwError from "../utils/throwError";
import { STATUS_CODES } from '../constants/status-codes.';
import { GetAccountsOptions } from '../types/account';

const changeRoleService = async ({ role, _id }: requestChangeRole) => {
    try {
        const user = await AccountAdmin.findOneAndUpdate({ _id: _id }, { role: role }, { new: true, runValidators: true })
        if (!user) {
            return throwError("User not found", STATUS_CODES.NOT_FOUND);
        }
        return {
            _id: user._id,
            role: user.role
        }
    } catch (error: any) {
        throw error;
    }
}

const getAllAccountsService = async (options: GetAccountsOptions) => {
    const { page = 1, limit = 10, key } = options;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (key?.trim()) {
        const k = key.trim();

        query.$or = [
            { fullName: { $regex: k, $options: "i" } },
            { username: { $regex: k, $options: "i" } },
            { code: { $regex: k, $options: "i" } },
        ];
    }


    const [data, total] = await Promise.all([
        AccountAdmin.find(query)
            .sort({ createdTime: -1 })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        AccountAdmin.countDocuments(query)
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
    try {
        const config = await Config.findOne({ _id: "CLIENT_VERSION" }).lean();
        if (!config) {
            return throwError("Not found config", STATUS_CODES.NOT_FOUND);
        }

        return config.data;
    } catch (error: any) {
        throw error;
    }
}

const setVersionClientService = async ({ version }: requestSetVersionClient) => {
    try {
        const config = await Config.findOneAndUpdate(
            { _id: "CLIENT_VERSION" },
            { data: { version } },
            { new: true }
        );

        if (!config) {
            return throwError("Not found config", STATUS_CODES.NOT_FOUND);
        }

        return config;
    } catch (error: any) {
        throw error;
    }
};

const toggleBanUserService = async ({ _id }: requestToggleBanUser) => {
    try {
        const user = await AccountAdmin.findById(_id);

        if (!user) {
            return throwError("User not found", STATUS_CODES.NOT_FOUND);
        }

        user.isDisabled = !user.isDisabled;
        await user.save();

        return {
            _id: user._id,
            isDisabled: user.isDisabled
        };
    } catch (error: any) {
        throw error;
    }
}

export { changeRoleService, getAllAccountsService, getVersionClientService, setVersionClientService, toggleBanUserService }