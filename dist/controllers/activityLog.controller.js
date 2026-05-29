"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogsController = void 0;
const api_response_1 = require("../utils/api-response");
const activityLog_service_1 = require("../services/activityLog.service");
const activityLogSchema_1 = require("../schemas/activityLogSchema");
const getActivityLogsController = async (req, res, next) => {
    try {
        const parsed = activityLogSchema_1.getActivityLogSchema.parse(req.query);
        const data = await (0, activityLog_service_1.getActivityLogsService)(parsed);
        api_response_1.ApiResponse.ok(res, "Get logs successfully", data);
    }
    catch (error) {
        next(error);
    }
};
exports.getActivityLogsController = getActivityLogsController;
