"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTournamentDetail = exports.getTournamentSchema = void 0;
const zod_1 = require("zod");
exports.getTournamentSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    status: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
});
exports.getTournamentDetail = zod_1.z.object({
    id: zod_1.z.string()
});
