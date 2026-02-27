import mongoose, { Schema } from "mongoose";

export interface IAccount {
    _id: string;
    avatarImage: string;
    code: string;
    coverImage: string;
    displayName: string;
    status: string;
    username: string;
    email: string;
    exp: number;
    level: number;
    gold: number;
    rank: string;
    ruby: number;
    tournamentScore: number;
    password: string;
    createdTime: Date;
    updatedTime: Date;
}

const AccountSchema: Schema = new Schema<IAccount>(
    {
        _id: { type: String, required: true },
        avatarImage: { type: String, required: true },
        code: { type: String, required: true },
        coverImage: { type: String, required: true },
        displayName: { type: String, required: true },
        status: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true },
        exp: { type: Number, required: true },
        level: { type: Number, required: true },
        gold: { type: Number, required: true },
        rank: { type: String, required: true },
        ruby: { type: Number, required: true },
        tournamentScore: { type: Number, required: true },
        password: { type: String, required: true },
        createdTime: { type: Date, required: true, default: Date.now },
        updatedTime: { type: Date, required: true, default: Date.now },
    }
);


const Account = mongoose.model<IAccount>("account", AccountSchema, "account");
export default Account;