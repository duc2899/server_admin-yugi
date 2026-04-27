import { STATUS_CODES } from '../constants/status-codes.';
import Card from "../models/card";
import throwError from "../utils/throwError";

type DeckCardInput = { code: string; number: number };

const mergeCardsByCode = (cards: DeckCardInput[]) => {
    const map = new Map<string, number>();

    for (const card of cards) {
        map.set(card.code, (map.get(card.code) || 0) + card.number);
    }

    return Array.from(map.entries()).map(([code, number]) => ({
        code,
        number,
    }));
};

export const validateDeckCards = async ({
    mainDeckCards,
    sideDeckCards,
    extraDeckCards,
}: {
    mainDeckCards: DeckCardInput[];
    sideDeckCards: DeckCardInput[];
    extraDeckCards: DeckCardInput[];
}) => {
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

    const cardsFromDb = await Card.find({ code: { $in: uniqueCodes } }).lean();
    const cardMap = new Map(cardsFromDb.map((c) => [c.code, c]));

    // check tồn tại card
    for (const code of uniqueCodes) {
        if (!cardMap.has(code)) {
            return throwError(`Card not found: ${code}`, STATUS_CODES.NOT_FOUND);
        }
    }

    // Forbidden
    for (const card of allCards) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo) continue;

        if (cardInfo.cardLimitStatus === 0) {
            return throwError(`Card ${cardInfo.name} is Forbidden`, STATUS_CODES.BAD_REQUEST);
        }

        if (cardInfo.activeStatus === 0) {
            return throwError(`Card ${cardInfo.name} is block`, STATUS_CODES.BAD_REQUEST);
        }
    }

    // check extra deck type
    const allowedExtraTypes = new Set(["FUSION", "SYNCHRO", "XYZ", "LINK"]);

    const isExtraDeckMonster = (categories: string[] = []) =>
        categories.some((c) => allowedExtraTypes.has(c));

    for (const card of cleanExtraDeckCards) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo) continue;

        if (!isExtraDeckMonster(cardInfo.monsterCategories)) {
            return throwError(
                `Card ${cardInfo.name} is not allowed in Extra Deck`,
                STATUS_CODES.BAD_REQUEST
            );
        }
    }

    // main/side không được chứa extra monster
    for (const card of [...cleanMainDeckCards, ...cleanSideDeckCards]) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo) continue;

        if (isExtraDeckMonster(cardInfo.monsterCategories)) {
            return throwError(
                `Card ${cardInfo.name} cannot be in Main/Side Deck (Extra Deck card)`,
                STATUS_CODES.BAD_REQUEST
            );
        }
    }

    // check limit theo name
    const getStrictestStatus = (statusList: number[]) => Math.min(...statusList);

    const totalByNameMap = new Map<string, number>();
    const statusByNameMap = new Map<string, number[]>();

    for (const card of allCards) {
        const cardInfo = cardMap.get(card.code);
        if (!cardInfo) continue;

        const name = cardInfo.name;

        totalByNameMap.set(name, (totalByNameMap.get(name) || 0) + card.number);

        if (!statusByNameMap.has(name)) statusByNameMap.set(name, []);
        statusByNameMap.get(name)!.push(cardInfo.cardLimitStatus);
    }

    for (const [name, total] of totalByNameMap.entries()) {
        const statusList = statusByNameMap.get(name) || [3];
        const strictestStatus = getStrictestStatus(statusList);

        let maxAllowed = 3;
        if (strictestStatus === 2) maxAllowed = 2;
        if (strictestStatus === 1) maxAllowed = 1;
        if (strictestStatus === 0) maxAllowed = 0;

        if (total > maxAllowed) {
            return throwError(
                `Card ${name} exceeds limit (${total}/${maxAllowed})`,
                STATUS_CODES.BAD_REQUEST
            );
        }
    }

    // return dữ liệu sạch để save DB
    return {
        mainDeckCards: cleanMainDeckCards,
        sideDeckCards: cleanSideDeckCards,
        extraDeckCards: cleanExtraDeckCards,
    };
};