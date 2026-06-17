"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeckAdminService = exports.saveDeckAdminService = exports.getDeckAdminDetailService = exports.getAllDeckAdminService = exports.createDeckAdminService = void 0;
const status_codes_1 = require("../constants/status-codes");
const deck_helper_1 = require("../helpers/deck.helper");
const deckAdmin_1 = __importDefault(require("../models/deckAdmin"));
const generateId_1 = require("../utils/generateId");
const throwError_1 = __importDefault(require("../utils/throwError"));
const card_1 = __importDefault(require("../models/card"));
const activityLog_service_1 = require("./activityLog.service");
const createDeckAdminService = async (payload, user, reqInfo) => {
    try {
        const { name, type = "DEFAULT", mainDeckCards, sideDeckCards, extraDeckCards } = payload;
        const cleanDeck = await (0, deck_helper_1.validateDeckCards)({ mainDeckCards, sideDeckCards, extraDeckCards });
        const newDeckAdmin = new deckAdmin_1.default({
            _id: (0, generateId_1.generateLongId)(),
            name,
            type,
            ...cleanDeck
        });
        await newDeckAdmin.save();
        await (0, activityLog_service_1.createActivityLogService)({
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
    }
    catch (error) {
        throw error;
    }
};
exports.createDeckAdminService = createDeckAdminService;
const getAllDeckAdminService = async () => {
    try {
        const data = await deckAdmin_1.default.find()
            .select("type name _id")
            .sort({ createdAt: -1 })
            .lean();
        return data.map((deck) => ({
            ...deck,
            _id: deck._id.toString(),
            isLocal: false
        }));
    }
    catch (error) {
        throw error;
    }
};
exports.getAllDeckAdminService = getAllDeckAdminService;
const saveDeckAdminService = async (payload, user, reqInfo) => {
    try {
        const { id, name, type, mainDeckCards, sideDeckCards, extraDeckCards } = payload;
        const deck = await deckAdmin_1.default.findById(id);
        if (!deck) {
            return (0, throwError_1.default)("Deck not found", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        // validate + normalize (return clean deck)
        const cleanDeck = await (0, deck_helper_1.validateDeckCards)({
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
        await (0, activityLog_service_1.createActivityLogService)({
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
    }
    catch (error) {
        throw error;
    }
};
exports.saveDeckAdminService = saveDeckAdminService;
const getDeckAdminDetailService = async ({ id }) => {
    try {
        const deck = await deckAdmin_1.default.findOne({ _id: id }).lean();
        if (!deck) {
            return (0, throwError_1.default)("Deck not found", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const allCodes = [
            ...deck.mainDeckCards,
            ...deck.sideDeckCards,
            ...deck.extraDeckCards,
        ].map((c) => c.code);
        const uniqueCodes = [...new Set(allCodes)];
        const cardsFromDb = await card_1.default.find({ code: { $in: uniqueCodes } }).lean();
        const cardMap = new Map(cardsFromDb.map((c) => [c.code, c]));
        const mapDeckCards = (cards, source) => {
            return cards.map((item) => {
                const cardInfo = cardMap.get(item.code);
                const type = cardInfo?.type || "";
                return {
                    _id: item.code,
                    number: item.number,
                    name: cardInfo?.name || "",
                    type,
                    category: type === "MONSTER"
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
    }
    catch (error) {
        throw error;
    }
};
exports.getDeckAdminDetailService = getDeckAdminDetailService;
const deleteDeckAdminService = async ({ id }) => {
    try {
        const deck = await deckAdmin_1.default.findOne({ _id: id });
        if (!deck) {
            return (0, throwError_1.default)("Deck not found", status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        await deckAdmin_1.default.deleteOne({ _id: id });
        return;
    }
    catch (error) {
        throw error;
    }
};
exports.deleteDeckAdminService = deleteDeckAdminService;
