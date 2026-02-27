import mongoose, { Schema } from "mongoose";

export interface ICard {
    _id: string;
    name: string;
    code: string;
    desc: string;
    descVN: string;
    type: string;
    level: number;
    atk: number;
    def: number;
    trapType: string;
    spellType: string;
    imageUrl: string;
    monsterType: string;
    monsterAttribute: string;
    monsterCategories: string[];
    sourceImageUrl: string;
    sourceThumbImage: string;
    sourceUrl: string;
    originCode: string;
    createdTime: Date;
    updatedTime: Date;

}

const CardSchema: Schema = new Schema<ICard>(
    {
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
        createdTime: { type: Date, required: true, default: Date.now },
        updatedTime: { type: Date, required: true, default: Date.now },
    }
);

CardSchema.index({ name: 1 });
CardSchema.index({ type: 1 });
CardSchema.index({ monsterType: 1 });
CardSchema.index({ monsterAttribute: 1 });
CardSchema.index({ level: 1 });

const Card = mongoose.model<ICard>("card", CardSchema, "card");
export default Card;