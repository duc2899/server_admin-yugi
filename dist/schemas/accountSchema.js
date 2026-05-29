"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountsSchema = void 0;
const zod_1 = require("zod");
exports.getAccountsSchema = zod_1.z.object({
    key: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
