export const DECK_TYPES = ["DEFAULT", "SELLER"] as const;
export type DeckType = (typeof DECK_TYPES)[number];