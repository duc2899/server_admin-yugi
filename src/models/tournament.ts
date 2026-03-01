import mongoose, { Schema } from "mongoose";

interface IRegester {
    accountId: string;
    deckCode: string;
    createdTime: Date;
}

export interface ITournament {
    _id: string;
    name: string;
    bannishCardCodes: string[];
    createdTime: Date;
    desc: string | null;
    image: string | null;
    limitNumberPlayers: number;
    registers: IRegester[];
    roundIndex: number;
    roundMatches: string[];
    roundPlayerIds: string[];
    roundStartedTime: Date;
    rubyFee: number;
    rubyReward: number;
    sponser: string | null;
    status: string;
    tournamentStartedTime: Date;
    type: string;
    updatedTime: Date;
    winPlayerId: string | null;
}

const tournamentSchema = new Schema<ITournament>({
    name: { type: String, required: true },
    bannishCardCodes: { type: [String], required: true },   
    createdTime: { type: Date, required: true },
    desc: { type: String, default: null },
    image: { type: String, default: null },
    limitNumberPlayers: { type: Number, required: true },
    registers: { type: [{ accountId: String, deckCode: String, createdTime: Date }], default: [] },
    roundIndex: { type: Number, default: 0 },
    roundMatches: { type: [String], default: [] },
    roundPlayerIds: { type: [String], default: [] },
    roundStartedTime: { type: Date, default: new Date(0) },
    rubyFee: { type: Number, required: true },
    rubyReward: { type: Number, required: true },
    sponser: { type: String, default: null },
    status: { type: String, required: true },
    tournamentStartedTime: { type: Date, default: new Date(0) },
    type: { type: String, required: true },
    updatedTime: { type: Date, default: new Date(0) },
    winPlayerId: { type: String, default: null },
});

const Tournament = mongoose.model<ITournament>("tournament", tournamentSchema);

export default Tournament;