import { PaginationOptions } from "./common";

export interface SearchCardOptions extends PaginationOptions {
  name?: string;
  category?: string; // monster | spell | trap
  monsterType?: string[];
  monsterAttribute?: string[];
  monsterCategory?: string[];
  gte?: number;
  lte?: number;
  spellType?: string;
  trapType?: string;
  sortBy?: string;
  atk?: number;
  def?: number;
  sortOrder?: "asc" | "desc";
}
export const TYPE_CARDS = {
  MONSTER: "MONSTER",
  SPELL: "SPELL",
  TRAP: "TRAP",
} as const;

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


export const MONSTER_CATEGORIES = [
  "NORMAL",
  "EFFECT",
  "RITUAL",
  "FUSION",
  "SYNCHRO",
  "XYZ",
  "LINK",
  "PENDULUM",
  "TOKEN",
  "FLIP",
  "SPIRIT",
  "TOON",
  "UNION",
  "GEMINI",
  "TUNER",
] as const;
