"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogsService = exports.createActivityLogService = void 0;
const activityLog_1 = __importDefault(require("../models/activityLog"));
const createActivityLogService = async (payload) => {
    try {
        await activityLog_1.default.create(payload);
        return true;
    }
    catch (error) {
        console.log("CREATE LOG ERROR:", error);
        return false; // log fail thì không nên làm fail API chính
    }
};
exports.createActivityLogService = createActivityLogService;
const getActivityLogsService = async ({ action, page, limit, }) => {
    const query = {};
    if (action)
        query.action = action;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        activityLog_1.default.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        activityLog_1.default.countDocuments(query),
    ]);
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getActivityLogsService = getActivityLogsService;
