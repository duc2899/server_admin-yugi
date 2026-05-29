"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_long_1 = __importDefault(require("mongoose-long"));
const deck_constant_1 = require("../constants/deck.constant");
(0, mongoose_long_1.default)(mongoose_1.default);
const { Long } = mongoose_1.Schema.Types;
const DeckCardSchema = new mongoose_1.Schema({
    code: { type: String, required: true },
    number: { type: Number, required: true },
}, { _id: false });
const DeckAdminSchema = new mongoose_1.Schema({
    _id: { type: Long, required: true },
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: deck_constant_1.DECK_TYPES, required: true, default: "DEFAULT" },
    mainDeckCards: { type: [DeckCardSchema], default: [] },
    sideDeckCards: { type: [DeckCardSchema], default: [] },
    extraDeckCards: { type: [DeckCardSchema], default: [] },
}, {
    timestamps: {
        createdAt: "createdTime",
        updatedAt: "updatedTime",
    },
});
const DeckAdmin = mongoose_1.default.model("deck_admin", DeckAdminSchema, "deck_admin");
exports.default = DeckAdmin;
