"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCardStatusFromSheetSchema = exports.setCardStatusSchema = exports.searchCardSchema = void 0;
const zod_1 = require("zod");
const cards_1 = require("../types/cards");
const commaSeparatedEnum = (allowedValues) => zod_1.z
    .string()
    .transform((val) => val.split(",").map((v) => v.trim().toUpperCase()))
    .refine((values) => values.every((v) => allowedValues.includes(v)), {
    message: `Invalid value. Allowed values: ${allowedValues.join(", ")}`,
})
    .transform((values) => values);
exports.searchCardSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    name: zod_1.z.string().optional(),
    category: zod_1.z.enum(Object.values(cards_1.TYPE_CARDS)).optional(),
    monsterType: commaSeparatedEnum(cards_1.MONSTER_TYPES).optional(),
    monsterAttribute: commaSeparatedEnum(cards_1.MONSTER_ATTRIBUTES).optional(),
    monsterCategory: commaSeparatedEnum(cards_1.MONSTER_CATEGORIES).optional(),
    lte: zod_1.z.coerce.number().optional(),
    gte: zod_1.z.coerce.number().optional(),
    atk: zod_1.z.coerce.number().optional(),
    def: zod_1.z.coerce.number().optional(),
    spellType: zod_1.z.enum(cards_1.SPELL_TYPES).optional(),
    trapType: zod_1.z.enum(cards_1.TRAP_TYPES).optional(),
    cardLimitStatus: zod_1.z.coerce.number().pipe(zod_1.z.union([
        zod_1.z.literal(0),
        zod_1.z.literal(1),
        zod_1.z.literal(2),
        zod_1.z.literal(3),
    ])).optional(),
    sortBy: zod_1.z.enum(["name", "atk", "def", "level"]).default("name"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
});
exports.setCardStatusSchema = zod_1.z.object({
    code: zod_1.z.string(),
    cardLimitStatus: zod_1.z.coerce.number().pipe(zod_1.z.union([
        zod_1.z.literal(0),
        zod_1.z.literal(1),
        zod_1.z.literal(2),
        zod_1.z.literal(3),
    ])),
    activeStatus: zod_1.z.coerce.number().pipe(zod_1.z.union([
        zod_1.z.literal(0),
        zod_1.z.literal(1),
    ])),
});
exports.syncCardStatusFromSheetSchema = zod_1.z.object({
    sheetUrl: zod_1.z.string().url(),
    gid: zod_1.z.string(),
    type: zod_1.z.enum(["ACTIVATE_STATUS", "LIMIT_STATUS"]),
});
