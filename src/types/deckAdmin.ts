import { DeckType } from "../constants/deck.constant";

export interface CreateDeckAdminPayload {
    name: string;
    type: DeckType;
    mainDeckCards: { code: string; number: number }[];
    sideDeckCards: { code: string; number: number }[];
    extraDeckCards: { code: string; number: number }[];
}