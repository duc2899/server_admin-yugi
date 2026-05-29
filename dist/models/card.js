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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CardSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    desc: { type: String, required: true },
    descVN: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: Number },
    atk: { type: Number },
    def: { type: Number },
    trapType: { type: String },
    spellType: { type: String },
    imageUrl: { type: String },
    monsterType: { type: String },
    monsterAttribute: { type: String },
    monsterCategories: { type: [String] },
    sourceImageUrl: { type: String },
    sourceThumbImage: { type: String },
    sourceUrl: { type: String },
    originCode: { type: String },
    cardLimitStatus: { type: Number, required: true },
    activeStatus: { type: Number, required: true },
    createdTime: { type: Date, required: true, default: Date.now },
    updatedTime: { type: Date, required: true, default: Date.now },
});
CardSchema.index({ name: 1 });
CardSchema.index({ code: 1 });
CardSchema.index({ type: 1 });
CardSchema.index({ monsterType: 1 });
CardSchema.index({ monsterAttribute: 1 });
CardSchema.index({ level: 1 });
const Card = mongoose_1.default.model("card", CardSchema, "card");
exports.default = Card;
