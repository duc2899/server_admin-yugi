"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCardStatusFromSheetService = exports.setStatusCardService = exports.searchCards = exports.getAllCards = void 0;
const cards_1 = require("../types/cards");
const card_1 = __importDefault(require("../models/card"));
const throwError_1 = __importDefault(require("../utils/throwError"));
const status_codes_1 = require("../constants/status-codes");
const googleSheet_helpers_1 = require("../helpers/googleSheet.helpers");
const activityLog_service_1 = require("./activityLog.service");
const getAllCards = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        card_1.default.find().skip(skip).limit(limit).lean(),
        card_1.default.countDocuments(),
    ]);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.getAllCards = getAllCards;
const searchCards = async (options) => {
    const { page = 1, limit = 10, name, category, monsterType, monsterAttribute, monsterCategory, lte, gte, spellType, trapType, atk, def, cardLimitStatus, sortBy = "name", sortOrder = "asc", } = options;
    const skip = (page - 1) * limit;
    const query = {};
    // 🔍 Search name hoặc code
    if (name) {
        query.$or = [
            { name: { $regex: name, $options: "i" } },
            { code: { $regex: name, $options: "i" } },
        ];
    }
    // 🎴 Filter category
    if (category) {
        query.type = category;
    }
    // 🐉 Monster filters (chỉ khi là monster)
    if (category === cards_1.TYPE_CARDS.MONSTER) {
        if (monsterType) {
            query.monsterType = { $in: monsterType };
        }
        if (monsterAttribute?.length) {
            query.monsterAttribute = { $in: monsterAttribute };
        }
        // 🎯 LEVEL FILTER
        if (gte !== undefined || lte !== undefined) {
            query.level = {
                ...(gte !== undefined && { $gte: gte }),
                ...(lte !== undefined && { $lte: lte }),
            };
        }
        // 🎯 ATK FILTER
        if (atk !== undefined) {
            query.atk = { $eq: atk };
        }
        // 🎯 DEF FILTER
        if (def !== undefined) {
            query.def = { $eq: def };
        }
        if (monsterCategory?.length) {
            query.monsterCategories = { $in: monsterCategory };
        }
    }
    // ✨ Spell filter
    if (category === cards_1.TYPE_CARDS.SPELL && spellType) {
        query.spellType = spellType;
    }
    // 🪤 Trap filter
    if (category === cards_1.TYPE_CARDS.TRAP && trapType) {
        query.trapType = trapType;
    }
    // 🚫 Card limit status filter
    if (cardLimitStatus !== undefined) {
        query.cardLimitStatus = cardLimitStatus;
    }
    const sortOption = {};
    sortOption.activeStatus = -1;
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;
    const [data, total] = await Promise.all([
        card_1.default.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
        card_1.default.countDocuments(query),
    ]);
    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.searchCards = searchCards;
const setStatusCardService = async ({ code, cardLimitStatus, activeStatus, }) => {
    const card = await card_1.default.findOneAndUpdate({ code }, { cardLimitStatus, activeStatus }, { new: true });
    if (!card) {
        return (0, throwError_1.default)("Card not found", 404);
    }
    // emitRefreshConfig();
    return card;
};
exports.setStatusCardService = setStatusCardService;
const syncCardStatusFromSheetService = async ({ sheetUrl, gid, type, }, user, reqInfo) => {
    try {
        if (!sheetUrl || gid === undefined) {
            return (0, throwError_1.default)("Missing sheetUrl or gid", status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
        const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (!match) {
            return (0, throwError_1.default)("Invalid Google Sheet URL", status_codes_1.STATUS_CODES.BAD_REQUEST);
        }
        const sheetId = match[1];
        const sheets = (0, googleSheet_helpers_1.getGoogleSheetsClient)();
        const metaRes = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetMeta = metaRes.data.sheets?.find((s) => s.properties?.sheetId === Number(gid));
        if (!sheetMeta) {
            return (0, throwError_1.default)(`Not found gid with value "${gid}"`, status_codes_1.STATUS_CODES.NOT_FOUND);
        }
        const tabName = sheetMeta.properties?.title;
        const dataRes = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: `${tabName}!A:D`,
        });
        const rows = dataRes.data.values ?? [];
        const [_header, ...dataRows] = rows;
        const results = {
            updated: [],
            skipped: [],
            notFound: [],
            errors: [],
        };
        const isActivateType = type === "ACTIVATE_STATUS";
        const validValues = isActivateType ? [0, 1] : [0, 1, 2, 3];
        const updateField = isActivateType ? "activeStatus" : "cardLimitStatus";
        // Ngoài for - chuẩn bị track row notFound
        const notFoundRowIndexes = [];
        for (let i = 0; i < dataRows.length; i++) {
            const [name, code, status, banish] = dataRows[i];
            const rawValue = isActivateType ? status : banish;
            if (!code || rawValue === undefined)
                continue;
            if (code === -1)
                continue;
            // Thêm vào đây
            if (rawValue?.trim() === "-1") {
                results.skipped.push(code);
                continue;
            }
            const parsedStatus = parseInt(rawValue);
            if (isNaN(parsedStatus) || !validValues.includes(parsedStatus)) {
                results.errors.push(`${code}: invalid status "${rawValue}" (chỉ chấp nhận ${validValues.join(", ")})`);
                continue;
            }
            const card = await card_1.default.findOne({ code })
                .select("activeStatus cardLimitStatus code")
                .lean();
            if (!card) {
                results.notFound.push(code);
                notFoundRowIndexes.push(i + 2); // +2 vì header + 1-indexed
                continue;
            }
            if (card[updateField] === parsedStatus) {
                results.skipped.push(code);
                continue;
            }
            await card_1.default.updateOne({ code }, { $set: { [updateField]: parsedStatus } });
            results.updated.push(code);
        }
        // Ghi -1 lên cột C (status) cho các row notFound
        if (notFoundRowIndexes.length > 0) {
            await sheets.spreadsheets.values.batchUpdate({
                spreadsheetId: sheetId,
                requestBody: {
                    valueInputOption: "RAW",
                    data: notFoundRowIndexes.map((rowIndex) => ({
                        range: `${tabName}!C${rowIndex}`, // cột C là status
                        values: [["-1"]],
                    })),
                },
            });
        }
        await (0, activityLog_service_1.createActivityLogService)({
            userId: user._id.toString(),
            username: user.username,
            action: "SYNC_CARD_STATUS",
            targetType: "CARD",
            targetId: sheetUrl,
            targetName: tabName,
            message: `${user.username} synced card status from sheet ${sheetUrl} (updated: ${results.updated.length}, skipped: ${results.skipped.length}, not found: ${results.notFound.length}, errors: ${results.errors.length})`,
            ip: reqInfo?.ip,
            userAgent: reqInfo?.userAgent,
            metadata: {
                sheetUrl,
                gid,
                type,
                results,
            }
        });
        return {
            tab: tabName,
            gid,
            type,
            summary: {
                total: dataRows.length,
                updated: results.updated.length,
                skipped: results.skipped.length,
                notFound: results.notFound.length,
                errors: results.errors.length,
            },
            details: results,
        };
    }
    catch (error) {
        throw error;
    }
};
exports.syncCardStatusFromSheetService = syncCardStatusFromSheetService;
