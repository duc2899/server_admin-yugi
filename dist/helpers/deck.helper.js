"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDeckCards = void 0;
const status_codes_1 = require("../constants/status-codes.");
const card_1 = __importDefault(require("../models/card"));
const throwError_1 = __importDefault(require("../utils/throwError"));
const mergeCardsByCode = (cards) => {
    const map = new Map();
    for (const card of cards) {
        map.set(card.code, (map.get(card.code) || 0) + card.number);
    }
    return Array.from(map.entries()).map(([code, number]) => ({
        code,
        number,
    }));
};
const validateDeckCards = async ({ mainDeckCards, sideDeckCards, extraDeckCards, }) => {
    // normalize (gộp code trùng nhau)
    const cleanMainDeckCards = mergeCardsByCode(mainDeckCards);
    const cleanSideDeckCards = mergeCardsByCode(sideDeckCards);
    const cleanExtraDeckCards = mergeCardsByCode(extraDeckCards);
    const allCards = [
        ...cleanMainDeckCards,
        ...cleanSideDeckCards,
        ...cleanExtraDeckCards,
    ];
    const uniqueCodes = [...new Set(allCards.map((c) => c.code))];
    const cardsFromDb = await card_1.default.find({ code: { $in: uniqueCodes } }).lean();
    const cardMap = new Map(cardsFromDb.map((c) => [c.code, c]));
    // check tồn tại card
    for (const code of uniqueCodes) {
        if (!cardMap.has(code)) {
            return (0, throwError_1.default)(`Card not found: ${code}`, status_codes_1.STATUS_CODES.NOT_FOUND);
        }
    }
    // Forbidden
    for (const card of allCards) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo)
            continue;
        if (cardInfo.cardLimitStatus === 0) {
            return (0, throwError_1.default)(`Card ${cardInfo.name} is Forbidden`, status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
        if (cardInfo.activeStatus === 0) {
            return (0, throwError_1.default)(`Card ${cardInfo.name} is block`, status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
    }
    // check extra deck type
    const allowedExtraTypes = new Set(["FUSION", "SYNCHRO", "XYZ", "LINK"]);
    const isExtraDeckMonster = (categories = []) => categories.some((c) => allowedExtraTypes.has(c));
    for (const card of cleanExtraDeckCards) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo)
            continue;
        if (!isExtraDeckMonster(cardInfo.monsterCategories)) {
            return (0, throwError_1.default)(`Card ${cardInfo.name} is not allowed in Extra Deck`, status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
    }
    // main/side không được chứa extra monster
    for (const card of [...cleanMainDeckCards, ...cleanSideDeckCards]) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo)
            continue;
        if (isExtraDeckMonster(cardInfo.monsterCategories)) {
            return (0, throwError_1.default)(`Card ${cardInfo.name} cannot be in Main/Side Deck (Extra Deck card)`, status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
    }
    // check limit theo name
    const getStrictestStatus = (statusList) => Math.min(...statusList);
    const totalByNameMap = new Map();
    const statusByNameMap = new Map();
    for (const card of allCards) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo)
            continue;
        const name = cardInfo.name;
        totalByNameMap.set(name, (totalByNameMap.get(name) || 0) + card.number);
        if (!statusByNameMap.has(name))
            statusByNameMap.set(name, []);
        statusByNameMap.get(name).push(cardInfo.cardLimitStatus);
    }
    for (const [name, total] of totalByNameMap.entries()) {
        const statusList = statusByNameMap.get(name) || [3];
        const strictestStatus = getStrictestStatus(statusList);
        let maxAllowed = 3;
        if (strictestStatus === 2)
            maxAllowed = 2;
        if (strictestStatus === 1)
            maxAllowed = 1;
        if (strictestStatus === 0)
            maxAllowed = 0;
        if (total > maxAllowed) {
            return (0, throwError_1.default)(`Card ${name} exceeds limit (${total}/${maxAllowed})`, status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
    }
    // return dữ liệu sạch để save DB
    return {
        mainDeckCards: cleanMainDeckCards,
        sideDeckCards: cleanSideDeckCards,
        extraDeckCards: cleanExtraDeckCards,
    };
};
exports.validateDeckCards = validateDeckCards;
