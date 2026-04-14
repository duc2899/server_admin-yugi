import mongoose, { Schema } from "mongoose";
import mongooseLong from "mongoose-long";
import { DECK_TYPES, DeckType } from '../constants/deck.constant';

mongooseLong(mongoose);

const { Long } = Schema.Types;

export interface IDeckCard {
    code: string;
    number: number;
}

export interface IDeckAdmin {
    _id: mongoose.Types.Long;
    createdTime?: Date;
    updatedTime?: Date;
    name: string;
    type: DeckType;
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

const DeckAdminSchema: Schema = new Schema<IDeckAdmin>(
    {
        _id: { type: Long, required: true },
        name: { type: String, required: true, unique: true },
        type: { type: String, enum: DECK_TYPES, required: true, default: "DEFAULT" },
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

const DeckAdmin = mongoose.model<IDeckAdmin>(
    "deck_admin",
    DeckAdminSchema,
    "deck_admin"
);

export default DeckAdmin;