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
    regesters: IRegester[];
    roundIndex: number;
    
}