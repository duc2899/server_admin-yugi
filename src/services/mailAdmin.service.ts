import { Model } from "mongoose";
import { IAccount } from "../models/account";
import { IMail, IMailReward } from "../models/mail";
import { generateLongId } from "../utils/generateId";

const normalizeRewards = (rewards: IMailReward[]): IMailReward[] =>
    (rewards || []).map((r) => {
        const type = String(r.type).trim().toUpperCase();
        if (type === "CARD") {
            return { type: "CARD", code: String(r.code).trim(), qty: Number(r.qty) };
        }
        return { type: "RUBY", code: null, qty: Number(r.qty) };
    });

const resolveAccountId = async (
    Account: Model<IAccount>,
    opts: { accountId?: string | number; username?: string }
): Promise<string> => {
    if (opts.accountId != null && String(opts.accountId).trim() !== "") {
        const id = String(opts.accountId).trim();
        const byId = await Account.findById(id).lean();
        if (!byId) {
            throw new Error("Account not found");
        }
        return String(byId._id);
    }
    const username = opts.username?.trim();
    if (!username) {
        throw new Error("accountId or username is required");
    }
    const byName = await Account.findOne({ username }).lean();
    if (!byName) {
        throw new Error("Account not found");
    }
    return String(byName._id);
};

export const sendMailAdmin = async (
    Mail: Model<IMail>,
    Account: Model<IAccount>,
    payload: {
        accountId?: string | number;
        username?: string;
        title: string;
        body?: string;
        rewards?: IMailReward[];
        createdBy?: string;
    }
) => {
    const accountId = await resolveAccountId(Account, payload);
    const now = new Date();
    const doc = await Mail.create({
        _id: generateLongId(),
        accountId,
        status: "UNREAD",
        title: payload.title.trim(),
        body: payload.body ?? "",
        rewards: normalizeRewards(payload.rewards || []),
        createdBy: payload.createdBy,
        createdTime: now,
        updatedTime: now,
    });
    return doc.toObject();
};

export const listMailsAdmin = async (
    Mail: Model<IMail>,
    Account: Model<IAccount>,
    opts: {
        accountId?: string | number;
        username?: string;
        page?: number;
        limit?: number;
    }
) => {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 20;
    const filter: Record<string, unknown> = {};
    if (opts.accountId != null || opts.username) {
        filter.accountId = await resolveAccountId(Account, opts);
    }
    const [data, total] = await Promise.all([
        Mail.find(filter)
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Mail.countDocuments(filter),
    ]);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
};
