import mongoose, { Schema } from "mongoose";
import mongooseLong from "mongoose-long";
import { createMultiDbModel } from "../utils/multiDbModel";

mongooseLong(mongoose);

const { Long } = Schema.Types;

export type MailStatus = "UNREAD" | "READ" | "CLAIMED";
export type MailRewardType = "CARD" | "RUBY" | string;

export interface IMailReward {
    type: MailRewardType;
    code?: string | null;
    qty: number;
}

export interface IMail {
    _id: mongoose.Types.Long;
    accountId: mongoose.Types.Long;
    status: MailStatus;
    title: string;
    body: string;
    rewards: IMailReward[];
    createdBy?: string;
    createdTime?: Date;
    updatedTime?: Date;
}

const MailRewardSchema = new Schema<IMailReward>(
    {
        type: { type: String, required: true },
        code: { type: String, required: false, default: null },
        qty: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const MailSchema: Schema = new Schema<IMail>(
    {
        _id: { type: Long, required: true },
        accountId: { type: Long, required: true, index: true },
        status: {
            type: String,
            enum: ["UNREAD", "READ", "CLAIMED"],
            required: true,
            default: "UNREAD",
        },
        title: { type: String, required: true },
        body: { type: String, required: true, default: "" },
        rewards: { type: [MailRewardSchema], default: [] },
        createdBy: { type: String, required: false },
        createdTime: { type: Date, required: true, default: Date.now },
        updatedTime: { type: Date, required: true, default: Date.now },
    },
    { collection: "mail" }
);

MailSchema.index({ accountId: 1, status: 1 });
MailSchema.index({ accountId: 1, _id: -1 });

export const Mail = createMultiDbModel<IMail>("mail", MailSchema, "mail");
