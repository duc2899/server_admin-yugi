import { DeckCount } from './../constants/deck.constant';
import z from "zod";
import { DECK_TYPES } from "../constants/deck.constant";


export const deckCardSchema = z.object({
    code: z.string().min(1, "Code is required"),
    number: z.number().int().min(1, "Number must be at least 1").max(3, "Number max is 3"),
});


const totalCards = (cards: { code: string; number: number }[]) =>
    cards.reduce((sum, card) => sum + card.number, 0)

const mainDeckSchema = z.array(deckCardSchema)
    .default([])
    .superRefine((cards, ctx) => {
        const total = totalCards(cards)
        if (total < DeckCount.MIN_MAIN_DECK) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Main deck min is ${DeckCount.MIN_MAIN_DECK} cards (current: ${total})`
            })
        }
        if (total > DeckCount.MAX_MAIN_DECK) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Main deck max is ${DeckCount.MAX_MAIN_DECK} cards (current: ${total})`
            })
        }
    })

const sideDeckSchema = z.array(deckCardSchema)
    .default([])
    .superRefine((cards, ctx) => {
        const total = totalCards(cards)
        if (total > DeckCount.MAX_SIDE_DECK) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Side deck max is ${DeckCount.MAX_SIDE_DECK} cards (current: ${total})`
            })
        }
    })

const extraDeckSchema = z.array(deckCardSchema)
    .default([])
    .superRefine((cards, ctx) => {
        const total = totalCards(cards)
        if (total > DeckCount.MAX_EXTRA_DECK) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Extra deck max is ${DeckCount.MAX_EXTRA_DECK} cards (current: ${total})`
            })
        }
    })


export const createDeckSchema = z.object({
    name: z.string().min(3, "Name must be at least 5 characters").max(25, "Name must be between 5 and 25 characters"),
    type: z.enum(DECK_TYPES).default("DEFAULT"),
    mainDeckCards: mainDeckSchema,
    sideDeckCards: sideDeckSchema,
    extraDeckCards: extraDeckSchema,
})

export const saveDeckSchema = createDeckSchema.extend({
    id: z.string(),
})

export const getDeckDetailSchema = z.object({
    id: z.string()
})

export const deleteDeckSchema = z.object({
    id: z.string()
})