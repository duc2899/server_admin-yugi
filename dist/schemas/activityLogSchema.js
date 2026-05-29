"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogSchema = void 0;
const zod_1 = require("zod");
const activityLog__constant_1 = require("../constants/activityLog..constant");
exports.getActivityLogSchema = zod_1.z.object({
    action: zod_1.z.enum(activityLog__constant_1.LOG_ACTIONS).optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
