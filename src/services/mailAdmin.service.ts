import mongoose, { Model } from "mongoose";
import { IAccount } from "../models/account";
import { IMail, IMailReward } from "../models/mail";
import { generateLongId } from "../utils/generateId";
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes";

const normalizeRewards = (rewards: IMailReward[]): IMailReward[] =>
    (rewards || []).map((r) => {
        const type = String(r.type).trim().toUpperCase();
        if (type === "CARD") {
            return { type: "CARD", code: String(r.code).trim(), qty: Number(r.qty) };
        }
        return { type: "RUBY", code: null, qty: Number(r.qty) };
    });

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Account _id is stored as BSON Long. The mongoose schema types it as String,
// so Model.find casts the query to a string and misses the document.
const idKey = (value: unknown): string => {
    if (value != null && (value as { _bsontype?: string })._bsontype === "Long") {
        return (value as { toString: () => string }).toString();
    }
    return String(value ?? "");
};

const idMatchValues = (id: string): Array<string | mongoose.mongo.Long> => {
    const values: Array<string | mongoose.mongo.Long> = [id];
    if (/^\d+$/.test(id)) {
        try {
            values.push(mongoose.mongo.Long.fromString(id));
        } catch {
            // not an int64
        }
    }
    return values;
};

// Native collection _id is typed as ObjectId. These ids are string or BSON Long.
const findAccountDocs = (Account: Model<IAccount>, filter: Record<string, unknown>) =>
    Account.collection.find(filter as never);

const findAccountsByIds = async (Account: Model<IAccount>, ids: string[]) => {
    if (!ids.length) return [];
    return findAccountDocs(Account, { _id: { $in: ids.flatMap(idMatchValues) } })
        .project({ _id: 1, username: 1, displayName: 1 })
        .toArray();
};

const resolveAccountId = async (
    Account: Model<IAccount>,
    opts: { accountId?: string | number; username?: string }
): Promise<string> => {
    if (opts.accountId != null && String(opts.accountId).trim() !== "") {
        const id = String(opts.accountId).trim();
        const [byId] = await findAccountsByIds(Account, [id]);
        if (!byId) {
            return throwError("Account not found", STATUS_CODES.NOT_FOUND);
        }
        return idKey(byId._id);
    }
    const username = opts.username?.trim();
    if (!username) {
        return throwError("accountId or username is required", STATUS_CODES.BAD_REQUEST);
    }
    const byName = await Account.findOne({ username }).lean();
    if (!byName) {
        return throwError("Account not found", STATUS_CODES.NOT_FOUND);
    }
    return idKey(byName._id);
};

export const searchMailRecipients = async (
    Account: Model<IAccount>,
    q: string,
    limit = 10
) => {
    const key = q.trim();
    if (!key) return [];

    const escaped = escapeRegex(key);
    const rows = await findAccountDocs(Account, {
        $or: [
            { username: { $regex: escaped, $options: "i" } },
            { _id: { $in: idMatchValues(key) } },
        ],
    })
        .project({ _id: 1, username: 1, displayName: 1 })
        .limit(limit)
        .toArray();

    return rows.map((row) => ({
        _id: idKey(row._id),
        username: String(row.username ?? ""),
        displayName: String(row.displayName ?? ""),
    }));
};

export const sendMailAdmin = async (
    Mail: Model<IMail>,
    Account: Model<IAccount>,
    payload: {
        accountIds: Array<string | number>;
        title: string;
        body?: string;
        rewards?: IMailReward[];
        createdBy?: string;
    }
) => {
    const ids = [...new Set(payload.accountIds.map((id) => String(id).trim()).filter(Boolean))];
    if (!ids.length) {
        return throwError("At least one recipient is required", STATUS_CODES.BAD_REQUEST);
    }

    const accounts = await findAccountsByIds(Account, ids);
    const found = new Set(accounts.map((account) => idKey(account._id)));
    const missing = ids.filter((id) => !found.has(id));
    if (missing.length) {
        return throwError(`Account not found: ${missing.join(", ")}`, STATUS_CODES.NOT_FOUND);
    }

    const now = new Date();
    const rewards = normalizeRewards(payload.rewards || []);
    const docs = ids.map((accountId) => ({
        _id: generateLongId(),
        accountId,
        status: "UNREAD" as const,
        title: payload.title.trim(),
        body: payload.body ?? "",
        rewards,
        createdBy: payload.createdBy,
        createdTime: now,
        updatedTime: now,
    }));

    const created = await Mail.insertMany(docs);
    return created.map((doc) => doc.toObject());
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
