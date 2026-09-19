import mongoose, { Schema } from "mongoose";
import mongooseLong from "mongoose-long";
import { createMultiDbModel } from "../utils/multiDbModel";

mongooseLong(mongoose);

const { Long } = Schema.Types;

export interface IDeckCard {
    code: string;
    number: number;
}

export interface IDeck {
    _id: mongoose.Types.Long;
    createdTime?: Date;
    updatedTime?: Date;
    name: string;
    playerId: mongoose.Types.Long;
    mainDeckCards: IDeckCard[];
    sideDeckCards: IDeckCard[];
    extraDeckCards: IDeckCard[];
}

const DeckCardSchema = new Schema<IDeckCard>(
    {
        code: { type: String, required: true },
        number: { type: Number, required: true },
    },
    { _id: false }
);

const DeckSchema: Schema = new Schema<IDeck>(
    {
        _id: { type: Long, required: true },
        name: { type: String, required: true, unique: true },
        playerId: { type: Long, required: true },
        mainDeckCards: { type: [DeckCardSchema], default: [] },
        sideDeckCards: { type: [DeckCardSchema], default: [] },
        extraDeckCards: { type: [DeckCardSchema], default: [] },
    },
    {
        timestamps: {
            createdAt: "createdTime",
            updatedAt: "updatedTime",
        },
    }
);

DeckCardSchema.index({ playerId: 1, name: 1 })

export const Deck = createMultiDbModel<IDeck>("deck", DeckSchema, "deck");
