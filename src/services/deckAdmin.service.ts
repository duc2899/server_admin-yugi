import { STATUS_CODES } from "../constants/status-codes.";
import { validateDeckCards } from "../helpers/deck.helper";
import DeckAdmin from "../models/deckAdmin";
import { CreateDeckAdminPayload, getDeckAdminDetialPayload } from "../types/deckAdmin";
import { generateLongId } from "../utils/generateId";
import throwError from "../utils/throwError";
import Card from "../models/card";

const createDeckAdminService = async (payload: CreateDeckAdminPayload) => {
    try {
        const { name, type = "DEFAULT", mainDeckCards, sideDeckCards, extraDeckCards } = payload;
        const cleanDeck = await validateDeckCards({ mainDeckCards, sideDeckCards, extraDeckCards });
        const newDeckAdmin = new DeckAdmin({
            _id: generateLongId(),
            name,
            type,
            ...cleanDeck
        });

        await newDeckAdmin.save();

        return {
            ...newDeckAdmin.toObject(),
            _id: newDeckAdmin._id.toString(),
        };

    } catch (error) {
        throw error;
    }
};

const getAllDeckAdminService = async () => {
    try {
        const data = await DeckAdmin.find()
            .select("type name _id")
            .sort({ createdAt: -1 })
            .lean();

        return data.map((deck) => ({
            ...deck,
            _id: deck._id.toString(),
        }));
    } catch (error) {
        throw error;
    }
};

const getDeckAdminDetailService = async ({ id }: getDeckAdminDetialPayload) => {
    try {
        const deck = await DeckAdmin.findOne({ _id: id }).lean();

        if (!deck) {
            return throwError("Deck not found", STATUS_CODES.NOT_FOUND);
        }

        const allCodes = [
            ...deck.mainDeckCards,
            ...deck.sideDeckCards,
            ...deck.extraDeckCards,
        ].map((c) => c.code);

        const uniqueCodes = [...new Set(allCodes)];

        const cardsFromDb = await Card.find({ code: { $in: uniqueCodes } })
            .select("code name type monsterCategories cardLimitStatus ")
            .lean();

        const cardMap = new Map(cardsFromDb.map((c) => [c.code, c]));

        const mapDeckCards = (
            cards: { code: string; number: number }[],
            source: "MAIN" | "SIDE" | "EXTRA"
        ) => {
            return cards.map((item) => {
                const cardInfo = cardMap.get(item.code);

                const type = cardInfo?.type || "";

                return {
                    ...item,
                    _id: item.code,
                    name: cardInfo?.name || "",
                    type,
                    category:
                        type === "MONSTER"
                            ? cardInfo?.monsterCategories?.[0] || ""
                            : "",
                    source,
                };
            });
        };

        return {
            ...deck,
            _id: deck._id.toString(),
            mainDeckCards: mapDeckCards(deck.mainDeckCards, "MAIN"),
            sideDeckCards: mapDeckCards(deck.sideDeckCards, "SIDE"),
            extraDeckCards: mapDeckCards(deck.extraDeckCards, "EXTRA"),
        };
    } catch (error) {
        throw error;
    }
};



export { createDeckAdminService, getAllDeckAdminService, getDeckAdminDetailService }

