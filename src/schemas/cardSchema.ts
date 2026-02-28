import { z } from "zod";
import { MONSTER_ATTRIBUTES, MONSTER_TYPES, SPELL_TYPES, TRAP_TYPES, TYPE_CARDS } from "../@types/cards";

export const searchCardSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    name: z.string().optional(),
    type: z.enum(TYPE_CARDS).optional(),
    monsterType: z.enum(MONSTER_TYPES).optional(),
    monsterAttribute: z.enum(MONSTER_ATTRIBUTES).optional(),
    level: z.coerce.number().optional(),
    spellType: z.enum(SPELL_TYPES).optional(),
    trapType: z.enum(TRAP_TYPES).optional(),
    sortBy: z.enum(["name", "atk", "def", "level"]).default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
})