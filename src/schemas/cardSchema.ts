import { z } from "zod";

export const searchCardSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    name: z.string().optional(),
    type: z.enum(["MONSTER", "SPELL", "TRAP"]).optional(),
    monsterType: z.string().optional(),
    monsterAttribute: z.string().optional(),
    level: z.coerce.number().optional(),
    spellType: z.string().optional(),
    trapType: z.string().optional(),
    sortBy: z.enum(["name", "atk", "def", "level"]).default("name"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
})