import { STATUS_CODES } from "../constants/status-codes.";
import { validateDeckCards } from "../helpers/deck.helper";
import DeckAdmin from "../models/deckAdmin";
import { CreateDeckAdminPayload, getDeckAdminDetialPayload, SaveDeckAdminPayload } from "../types/deckAdmin";
import { generateLongId } from "../utils/generateId";
import throwError from "../utils/throwError";
import Card from "../models/card";
import { createActivityLogService } from "./activityLog.service";
import { JwtPayload, ReqInfor } from "../types/common";

const createDeckAdminService = async (payload: CreateDeckAdminPayload, user: JwtPayload, reqInfo?: ReqInfor) => {
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

        await createActivityLogService({
            userId: user._id.toString(),
            username: user.username,
            action: "CREATE_DECK",
            targetType: "DECK",
            targetId: newDeckAdmin._id.toString(),
            targetName: newDeckAdmin.name,
            message: `${user.username} created deck ${newDeckAdmin.name}`,
            ip: reqInfo?.ip,
            userAgent: reqInfo?.userAgent,
            metadata: {
                deckType: type,
            },
        });

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
            isLocal: false
        }));
    } catch (error) {
        throw error;
    }
};

const saveDeckAdminService = async (payload: SaveDeckAdminPayload, user: JwtPayload, reqInfo?: ReqInfor) => {
    try {
        const { id, name, type, mainDeckCards, sideDeckCards, extraDeckCards } = payload;

        const deck = await DeckAdmin.findById(id);
        if (!deck) {
            return throwError("Deck not found", STATUS_CODES.NOT_FOUND);
        }

        // validate + normalize (return clean deck)
        const cleanDeck = await validateDeckCards({
            mainDeckCards,
            sideDeckCards,
            extraDeckCards,
        });

        deck.name = name;
        deck.type = type;
        deck.mainDeckCards = cleanDeck.mainDeckCards;
        deck.sideDeckCards = cleanDeck.sideDeckCards;
        deck.extraDeckCards = cleanDeck.extraDeckCards;

        await deck.save();

        
        await createActivityLogService({
            userId: user._id.toString(),
            username: user.username,
            action: "UPDATE_DECK",
            targetType: "DECK",
            targetId: deck._id.toString(),
            targetName: deck.name,
            message: `${user.username} save deck ${deck.name}`,
            ip: reqInfo?.ip,
            userAgent: reqInfo?.userAgent,
            metadata: {
                deckType: type,
            },
        });

        return {
            ...deck.toObject(),
            _id: deck._id.toString(),
        };
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

        const cardsFromDb = await Card.find({ code: { $in: uniqueCodes } }).lean();

        const cardMap = new Map(cardsFromDb.map((c) => [c.code, c]));

        const mapDeckCards = (
            cards: { code: string; number: number }[],
            source: "MAIN" | "SIDE" | "EXTRA"
        ) => {
            return cards.map((item) => {
                const cardInfo = cardMap.get(item.code);

                const type = cardInfo?.type || "";

                return {
                    _id: item.code,
                    number: item.number,
                    name: cardInfo?.name || "",
                    type,
                    category:
                        type === "MONSTER"
                            ? cardInfo?.monsterCategories?.[0] || ""
                            : "",
                    source,
                    data: {
                        ...cardInfo,
                    }
                };
            });
        };
        

        return {
            ...deck,
            _id: deck._id.toString(),
            mainDeckCards: mapDeckCards(deck.mainDeckCards, "MAIN"),
            sideDeckCards: mapDeckCards(deck.sideDeckCards, "SIDE"),
            extraDeckCards: mapDeckCards(deck.extraDeckCards, "EXTRA"),
            isLocal: false
        };
    } catch (error) {
        throw error;
    }
};

export { createDeckAdminService, getAllDeckAdminService, getDeckAdminDetailService, saveDeckAdminService }

