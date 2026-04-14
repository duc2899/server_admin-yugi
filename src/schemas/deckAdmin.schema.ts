import z from "zod";
import { DECK_TYPES } from "../constants/deck.constant";

export const deckCardSchema = z.object({
    code: z.string().min(1, "Code is required"),
    number: z.number().int().min(1, "Number must be at least 1").max(3, "Number max is 3"),
});

export const createDeckSchema = z.object({
    name: z.string().min(3, "Name must be at least 5 characters").max(25, "Name must be between 5 and 25 characters"),
    type: z.enum(DECK_TYPES).default("DEFAULT"),
    mainDeckCards: z.array(deckCardSchema).default([]),
    sideDeckCards: z.array(deckCardSchema).default([]),
    extraDeckCards: z.array(deckCardSchema).default([]),
})