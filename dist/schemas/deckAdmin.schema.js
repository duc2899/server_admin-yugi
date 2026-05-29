"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeckSchema = exports.getDeckDetailSchema = exports.saveDeckSchema = exports.createDeckSchema = exports.deckCardSchema = void 0;
const deck_constant_1 = require("./../constants/deck.constant");
const zod_1 = __importDefault(require("zod"));
const deck_constant_2 = require("../constants/deck.constant");
exports.deckCardSchema = zod_1.default.object({
    code: zod_1.default.string().min(1, "Code is required"),
    number: zod_1.default.number().int().min(1, "Number must be at least 1").max(3, "Number max is 3"),
});
const totalCards = (cards) => cards.reduce((sum, card) => sum + card.number, 0);
const mainDeckSchema = zod_1.default.array(exports.deckCardSchema)
    .default([])
    .superRefine((cards, ctx) => {
    const total = totalCards(cards);
    if (total < deck_constant_1.DeckCount.MIN_MAIN_DECK) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: `Main deck min is ${deck_constant_1.DeckCount.MIN_MAIN_DECK} cards (current: ${total})`
        });
    }
    if (total > deck_constant_1.DeckCount.MAX_MAIN_DECK) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: `Main deck max is ${deck_constant_1.DeckCount.MAX_MAIN_DECK} cards (current: ${total})`
        });
    }
});
const sideDeckSchema = zod_1.default.array(exports.deckCardSchema)
    .default([])
    .superRefine((cards, ctx) => {
    const total = totalCards(cards);
    if (total > deck_constant_1.DeckCount.MAX_SIDE_DECK) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: `Side deck max is ${deck_constant_1.DeckCount.MAX_SIDE_DECK} cards (current: ${total})`
        });
    }
});
const extraDeckSchema = zod_1.default.array(exports.deckCardSchema)
    .default([])
    .superRefine((cards, ctx) => {
    const total = totalCards(cards);
    if (total > deck_constant_1.DeckCount.MAX_EXTRA_DECK) {
        ctx.addIssue({
            code: zod_1.default.ZodIssueCode.custom,
            message: `Extra deck max is ${deck_constant_1.DeckCount.MAX_EXTRA_DECK} cards (current: ${total})`
        });
    }
});
exports.createDeckSchema = zod_1.default.object({
    name: zod_1.default.string().min(3, "Name must be at least 5 characters").max(25, "Name must be between 5 and 25 characters"),
    type: zod_1.default.enum(deck_constant_2.DECK_TYPES).default("DEFAULT"),
    mainDeckCards: mainDeckSchema,
    sideDeckCards: sideDeckSchema,
    extraDeckCards: extraDeckSchema,
});
exports.saveDeckSchema = exports.createDeckSchema.extend({
    id: zod_1.default.string(),
});
exports.getDeckDetailSchema = zod_1.default.object({
    id: zod_1.default.string()
});
exports.deleteDeckSchema = zod_1.default.object({
    id: zod_1.default.string()
});
