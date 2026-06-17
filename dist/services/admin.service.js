"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleBanUserService = exports.setVersionClientService = exports.getVersionClientService = exports.getAllAccountsService = exports.changeRoleService = void 0;
const accountAdmin_1 = __importDefault(require("../models/accountAdmin"));
const config_1 = __importDefault(require("../models/config"));
const throwError_1 = __importDefault(require("../utils/throwError"));
const status_codes_1 = require("../constants/status-codes");
const version_constant_1 = require("../constants/version.constant");
const activityLog_service_1 = require("./activityLog.service");
const changeRoleService = async ({ role, _id }, user, reqInfo) => {
    try {
        const userDB = await accountAdmin_1.default.findOneAndUpdate({ _id: _id }, { role: role }, { new: true, runValidators: true });
        if (!userDB) {
            return (0, throwError_1.default)("User not found", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        await (0, activityLog_service_1.createActivityLogService)({
            userId: user._id.toString(),
            username: user.username,
            action: "CHANGE_ROLE",
            targetType: "SYSTEM",
            targetId: userDB._id.toString(),
            targetName: userDB.username,
            message: `${user.username} change role ${userDB.username} by role ${role}`,
            ip: reqInfo?.ip,
            userAgent: reqInfo?.userAgent,
            metadata: {
                roleType: role,
            },
        });
        return {
            _id: user._id,
            role: user.role
        };
    }
    catch (error) {
        throw error;
    }
};
exports.changeRoleService = changeRoleService;
const getAllAccountsService = async (options) => {
    const { page = 1, limit = 10, key } = options;
    const skip = (page - 1) * limit;
    const query = {};
    if (key?.trim()) {
        const k = key.trim();
        query.$or = [
            { fullName: { $regex: k, $options: "i" } },
            { username: { $regex: k, $options: "i" } },
            { code: { $regex: k, $options: "i" } },
        ];
    }
    const [data, total] = await Promise.all([
        accountAdmin_1.default.find(query)
            .sort({ createdTime: -1 })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        accountAdmin_1.default.countDocuments(query)
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
};
exports.getAllAccountsService = getAllAccountsService;
const getVersionClientService = async () => {
    try {
        const config = await config_1.default.find({
            _id: { $in: version_constant_1.VERSIONS }
        }).lean();
        if (!config || config.length === 0) {
            return (0, throwError_1.default)("Not found config", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        return config;
    }
    catch (error) {
        throw error;
    }
};
exports.getVersionClientService = getVersionClientService;
const setVersionClientService = async ({ version, type }, user, reqInfo) => {
    try {
        const config = await config_1.default.findOneAndUpdate({ _id: type }, { data: { version } }, { new: true });
        if (!config) {
            return (0, throwError_1.default)("Not found config", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        await (0, activityLog_service_1.createActivityLogService)({
            userId: user._id.toString(),
            username: user.username,
            action: "SET_VERSION",
            targetType: "SYSTEM",
            targetId: config._id.toString(),
            targetName: version + ` (${config._id.toString()})`,
            message: `${user.username} set version ${version}`,
            ip: reqInfo?.ip,
            userAgent: reqInfo?.userAgent,
            metadata: {
                versionType: config._id.toString(),
                version
            },
        });
        return config;
    }
    catch (error) {
        throw error;
    }
};
exports.setVersionClientService = setVersionClientService;
const toggleBanUserService = async ({ _id }) => {
    try {
        const user = await accountAdmin_1.default.findById(_id);
        if (!user) {
            return (0, throwError_1.default)("User not found", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        user.isDisabled = !user.isDisabled;
        await user.save();
        return {
            _id: user._id,
            isDisabled: user.isDisabled
        };
    }
    catch (error) {
        throw error;
    }
};
exports.toggleBanUserService = toggleBanUserService;
