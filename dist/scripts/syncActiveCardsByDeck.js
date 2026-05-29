"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../configs/db");
const card_1 = __importDefault(require("../models/card"));
const deck_1 = __importDefault(require("../models/deck"));
const DECK_NAMES = [
    "Blue eyes deck",
    "Dark Magician deck",
    "Red-eyes",
];
const PLAYER_ID = 4608957029469208; // <-- sửa playerId của m
const syncActiveCardsByDeck = async () => {
    try {
        console.log("Connecting DB...");
        await (0, db_1.connectDB)();
        console.log("DB connected!");
        console.log("Finding decks...");
        const decks = await deck_1.default.find({
            playerId: PLAYER_ID,
            name: { $in: DECK_NAMES },
        }).lean();
        console.log(`Found ${decks.length} decks`);
        if (decks.length === 0) {
            console.log("No decks found -> STOP");
            return;
        }
        const codeSet = new Set();
        for (const deck of decks) {
            const allCards = [
                ...(deck.mainDeckCards || []),
                ...(deck.sideDeckCards || []),
                ...(deck.extraDeckCards || []),
            ];
            for (const c of allCards) {
                if (c?.code)
                    codeSet.add(String(c.code));
            }
        }
        const codes = Array.from(codeSet);
        console.log(`Total unique card codes in decks: ${codes.length}`);
        if (codes.length === 0) {
            console.log("No codes found in decks -> STOP");
            return;
        }
        console.log("Updating cards not in deck list => activeStatus = 0...");
        const disableResult = await card_1.default.updateMany({ code: { $nin: codes } }, { $set: { activeStatus: 0 } });
        console.log(`Disabled: matched=${disableResult.matchedCount}, modified=${disableResult.modifiedCount}`);
        console.log("Updating cards in deck list => activeStatus = 1...");
        const enableResult = await card_1.default.updateMany({ code: { $in: codes } }, { $set: { activeStatus: 1 } });
        console.log(`Enabled: matched=${enableResult.matchedCount}, modified=${enableResult.modifiedCount}`);
        console.log("DONE sync activeStatus!");
        await mongoose_1.default.disconnect();
        console.log("Disconnected DB!");
    }
    catch (err) {
        console.error("SYNC FAILED:", err);
        process.exit(1);
    }
};
syncActiveCardsByDeck();
