import mongoose, { Model } from "mongoose";
import { IAccount } from "../models/account";
import { ICard } from "../models/card";
import { IMail, IMailReward } from "../models/mail";
import { generateLongId } from "../utils/generateId";
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes";
import { MailStatus, MailRewardType } from "../constants/mail.constant";
import { createActivityLogService } from "./activityLog.service";
import { JwtPayload, ReqInfor } from "../types/common";
import { LogAction, TargetType } from "../constants/activityLog..constant";


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
    Card: Model<ICard>,
    payload: {
        accountIds: Array<string | number>;
        title: string;
        body?: string;
        rewards?: IMailReward[];
        createdBy?: string;
    },
    user: JwtPayload,
    reqInfo?: ReqInfor
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
    await assertCardsExist(Card, rewards);
    const docs = ids.map((accountId) => ({
        _id: generateLongId(),
        accountId,
        status: MailStatus.UNREAD as MailStatus,
        title: payload.title.trim(),
        body: payload.body ?? "",
        rewards,
        createdBy: payload.createdBy,
        createdTime: now,
        updatedTime: now,
    }));

    const created = await Mail.insertMany(docs);


    await createActivityLogService({
        userId: String(user._id ?? ""),
        username: user?.username,
        action: LogAction.SEND_MAIL as LogAction,
        targetType: TargetType.MAIL as TargetType,
        targetId: String(created[0]?._id.toString() ?? ""),
        targetName: payload.title,
        message: `${user.username} sent mail "${payload.title}" to ${accounts.length} account(s)`,
        ip: reqInfo?.ip,
        userAgent: reqInfo?.userAgent,
        metadata: {
            accountIds: accounts.map((account) => idKey(account._id)),
            mailIds: created.map((mail) => String(mail._id)),
            rewards: rewards,
        },
    });
    return created.map((doc) => doc.toObject());
};

export const listMailsAdmin = async (
    Mail: Model<IMail>,
    Account: Model<IAccount>,
    Card: Model<ICard>,
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
        data: await withRewardLabels(Card, data),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
};

export const recallMailAdmin = async (Mail: Model<IMail>, mailId: string | number, user: JwtPayload, reqInfo?: ReqInfor) => {
    const id = String(mailId).trim();
    const mail = await Mail.findById(id).lean();
    if (!mail) {
        return throwError("Không tìm thấy thư", STATUS_CODES.NOT_FOUND);
    }
    if (mail.status === MailStatus.CLAIMED) {
        return throwError("Thư đã được nhận, không thể thu hồi", STATUS_CODES.BAD_REQUEST);
    }

    await Mail.deleteOne({ _id: id });

    await createActivityLogService({
        userId: String(user._id ?? ""),
        username: user.username,
        action: LogAction.RECALL_MAIL as LogAction,
        targetType: TargetType.MAIL as TargetType,
        targetId: String(mail._id),
        targetName: mail.title,
        message: `${user.username} recalled mail "${mail.title}"`,
        ip: reqInfo?.ip,
        userAgent: reqInfo?.userAgent,
        metadata: {
            accountId: String(mail.accountId),
            status: mail.status,
            rewards: mail.rewards,
        },
    });
    return {
        ...mail,
        _id: idKey(mail._id),
        accountId: idKey(mail.accountId),
    };
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

const normalizeRewards = (rewards: IMailReward[]): IMailReward[] =>
    (rewards || []).map((r) => {
        const qty = Number(r.qty);
        if (!Number.isInteger(qty) || qty < 1) {
            return throwError("Số lượng phải lớn hơn hoặc bằng 1", STATUS_CODES.BAD_REQUEST);
        }
        const type = String(r.type).trim().toUpperCase();
        if (type === MailRewardType.CARD) {
            return { type: MailRewardType.CARD, code: String(r.code).trim(), qty };
        }
        return { type: MailRewardType.RUBY, code: null, qty };
    }) ?? [];

const assertCardsExist = async (Card: Model<ICard>, rewards: IMailReward[]) => {
    const codes = [
        ...new Set(
            rewards
                .filter((reward) => reward.type === MailRewardType.CARD && reward.code)
                .map((reward) => String(reward.code))
        ),
    ];
    if (!codes.length) return;

    const cards = await Card.find({ code: { $in: codes } }).select("code").lean();
    const found = new Set(cards.map((card) => card.code));
    const missing = codes.filter((code) => !found.has(code));
    if (missing.length) {
        throwError(`Không tìm thấy thẻ: ${missing.join(", ")}`, STATUS_CODES.BAD_REQUEST);
    }
};

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


const withRewardLabels = async (Card: Model<ICard>, mails: Array<IMail & { rewards?: IMailReward[] }>) => {
    const codes = [
        ...new Set(
            mails.flatMap((mail) =>
                (mail.rewards || [])
                    .filter((reward) => reward.type === MailRewardType.CARD && reward.code)
                    .map((reward) => String(reward.code))
            )
        ),
    ];
    const cards = codes.length
        ? await Card.find({ code: { $in: codes } }).select("code name").lean()
        : [];
    const nameByCode = new Map(cards.map((card) => [card.code, card.name]));

    return mails.map((mail) => ({
        ...mail,
        _id: idKey(mail._id),
        accountId: idKey(mail.accountId),
        rewards: (mail.rewards || []).map((reward) => {
            if (reward.type === MailRewardType.CARD) {
                const code = String(reward.code || "");
                return {
                    ...reward,
                    rewardName: "Thẻ bài",
                    itemName: nameByCode.get(code) || code || "Không rõ thẻ",
                };
            }
            return {
                ...reward,
                rewardName: "Ruby",
                itemName: "Ruby",
            };
        }),
    }));
};