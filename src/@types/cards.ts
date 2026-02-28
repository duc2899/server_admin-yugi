import { PaginationOptions } from "./common";

export interface SearchCardOptions extends PaginationOptions {
  name?: string;
  type?: string; // monster | spell | trap
  monsterType?: string;
  monsterAttribute?: string;
  level?: number;
  spellType?: string;
  trapType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
export const TYPE_CARDS = ["MONSTER", "SPELL", "TRAP"] as const;

export const MONSTER_ATTRIBUTES = [
  "DARK",
  "LIGHT",
  "WATER",
  "FIRE",
  "EARTH",
  "WIND",
  "DIVINE",
] as const;

export const MONSTER_TYPES = [
  "DRAGON",
  "WARRIOR",
  "SPELLCASTER",
  "FIEND",
  "FAIRY",
  "MACHINE",
  "BEAST",
  "BEAST_WARRIOR",
  "ZOMBIE",
  "ROCK",
  "PYRO",
  "AQUA",
  "THUNDER",
  "INSECT",
  "PLANT",
  "REPTILE",
  "FISH",
  "SEA_SERPENT",
  "DINOSAUR",
  "PSYCHIC",
  "CYBERSE",
  "DIVINE_BEAST",
] as const;

export const SPELL_TYPES = [
  "NORMAL",
  "QUICK_PLAY",
  "CONTINUOUS",
  "EQUIP",
  "FIELD",
  "RITUAL",
] as const;

export const TRAP_TYPES = [
  "NORMAL",
  "CONTINUOUS",
  "COUNTER",
] as const;
