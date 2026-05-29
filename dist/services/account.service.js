"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAccounts = void 0;
const account_1 = __importDefault(require("../models/account"));
const getAllAccounts = async (options) => {
    const { page = 1, limit = 10, key } = options;
    const skip = (page - 1) * limit;
    const query = {};
    if (key?.trim()) {
        const k = key.trim();
        query.$or = [
            { displayName: { $regex: k, $options: "i" } },
            { email: { $regex: k, $options: "i" } },
            { code: { $regex: k, $options: "i" } },
        ];
    }
    const [data, total] = await Promise.all([
        account_1.default.find(query)
            .sort({ createdTime: -1 })
            .select("-password")
            .skip(skip)
            .limit(limit)
            .lean(),
        account_1.default.countDocuments(query)
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
exports.getAllAccounts = getAllAccounts;
