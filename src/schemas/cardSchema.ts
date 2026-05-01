import { z } from "zod";
import {
  MONSTER_ATTRIBUTES,
  MONSTER_CATEGORIES,
  MONSTER_TYPES,
  SPELL_TYPES,
  TRAP_TYPES,
  TYPE_CARDS,
} from "../types/cards";

const commaSeparatedEnum = <T extends readonly string[]>(
  allowedValues: T
) =>
  z
    .string()
    .transform((val) =>
      val.split(",").map((v) => v.trim().toUpperCase())
    )
    .refine(
      (values) =>
        values.every((v) =>
          allowedValues.includes(v as T[number])
        ),
      {
        message: `Invalid value. Allowed values: ${allowedValues.join(", ")}`,
      }
    )
    .transform((values) => values as T[number][]);

export const searchCardSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  name: z.string().optional(),
  category: z.enum(Object.values(TYPE_CARDS)).optional(),
  monsterType: commaSeparatedEnum(MONSTER_TYPES).optional(),
  monsterAttribute: commaSeparatedEnum(MONSTER_ATTRIBUTES).optional(),
  monsterCategory: commaSeparatedEnum(MONSTER_CATEGORIES).optional(),
  lte: z.coerce.number().optional(),
  gte: z.coerce.number().optional(),
  atk: z.coerce.number().optional(),
  def: z.coerce.number().optional(),
  spellType: z.enum(SPELL_TYPES).optional(),
  trapType: z.enum(TRAP_TYPES).optional(),
  cardLimitStatus: z.coerce.number().pipe(
    z.union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
    ])
  ).optional(),
  sortBy: z.enum(["name", "atk", "def", "level"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const setCardStatusSchema = z.object({
  code: z.string(),
  cardLimitStatus: z.coerce.number().pipe(
    z.union([
      z.literal(0),
      z.literal(1),
      z.literal(2),
      z.literal(3),
    ])
  ),
  activeStatus: z.coerce.number().pipe(
    z.union([
      z.literal(0),
      z.literal(1),
    ])
  ),
});

export const syncCardStatusFromSheetSchema = z.object({
  sheetUrl: z.string().url(),
  gid: z.string(),
});

