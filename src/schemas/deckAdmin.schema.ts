import { DeckCount } from './../constants/deck.constant';
import z from "zod";
import { DECK_TYPES } from "../constants/deck.constant";

export const deckCardSchema = z.object({
    code: z.string().min(1, "Code is required"),
    number: z.number().int().min(1, "Number must be at least 1").max(3, "Number max is 3"),
});

export const createDeckSchema = z.object({
    name: z.string().min(3, "Name must be at least 5 characters").max(25, "Name must be between 5 and 25 characters"),
    type: z.enum(DECK_TYPES).default("DEFAULT"),
    mainDeckCards:
        z.array(deckCardSchema)
            // .min(DeckCount.MIN_MAIN_DECK, `Main deck min is ${DeckCount.MIN_MAIN_DECK}`)
            .max(DeckCount.MAX_MAIN_DECK, `Main deck min is ${DeckCount.MAX_MAIN_DECK}`)
            .default([]),
    sideDeckCards: z.array(deckCardSchema).max(DeckCount.MAX_SIDE_DECK, `Side deck min is ${DeckCount.MAX_SIDE_DECK}`).default([]),
    extraDeckCards: z.array(deckCardSchema).max(DeckCount.MAX_EXTRA_DECK, `Extra deck min is ${DeckCount.MAX_EXTRA_DECK}`).default([]),
})

export const saveDeckSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Name must be at least 5 characters").max(25, "Name must be between 5 and 25 characters"),
    type: z.enum(DECK_TYPES).default("DEFAULT"),
    mainDeckCards:
        z.array(deckCardSchema)
            // .min(DeckCount.MIN_MAIN_DECK, `Main deck min is ${DeckCount.MIN_MAIN_DECK}`)
            .max(DeckCount.MAX_MAIN_DECK, `Main deck min is ${DeckCount.MAX_MAIN_DECK}`)
            .default([]),
    sideDeckCards: z.array(deckCardSchema).max(DeckCount.MAX_SIDE_DECK, `Side deck min is ${DeckCount.MAX_SIDE_DECK}`).default([]),
    extraDeckCards: z.array(deckCardSchema).max(DeckCount.MAX_EXTRA_DECK, `Extra deck min is ${DeckCount.MAX_EXTRA_DECK}`).default([]),
})

export const getDeckDetailSchema = z.object({
    id: z.string()
})