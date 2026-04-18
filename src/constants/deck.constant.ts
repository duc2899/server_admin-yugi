export const DECK_TYPES = ["DEFAULT", "SELLER"] as const;
export type DeckType = (typeof DECK_TYPES)[number];
export const DeckCount = {
    MAX_MAIN_DECK: 60,
    MIN_MAIN_DECK: 40,
    MAX_SIDE_DECK: 15,
    MAX_EXTRA_DECK: 15
} as const