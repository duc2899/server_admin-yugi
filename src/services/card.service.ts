import {
  requestCardSetStatus,
  SearchCardOptions,
  SyncCardStatusFromSheetPayload,
  TYPE_CARDS,
} from "../types/cards";
import { JwtPayload, PaginationOptions, ReqInfor } from "../types/common";
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes";
import { getGoogleSheetsClient } from "../helpers/googleSheet.helpers";
import { createActivityLogService } from "./activityLog.service";
import { ICard } from "../models/card";
import { Model } from "mongoose";

const getAllCards = async (Card: Model<ICard>, { page = 1, limit = 10 }: PaginationOptions) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Card.find().skip(skip).limit(limit).lean(),
    Card.countDocuments(),
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

const searchCards = async (Card: Model<ICard>, options: SearchCardOptions) => {
  const {
    page = 1,
    limit = 10,
    name,
    category,
    monsterType,
    monsterAttribute,
    monsterCategory,
    lte,
    gte,
    spellType,
    trapType,
    atk,
    def,
    cardLimitStatus,
    sortBy = "name",
    sortOrder = "asc",
  } = options;

  const skip = (page - 1) * limit;
  const query: any = {};

  // 🔍 Search name hoặc code
  if (name) {
    query.$or = [
      { name: { $regex: name, $options: "i" } },
      { code: { $regex: name, $options: "i" } },
    ]
  }

  // 🎴 Filter category
  if (category) {
    query.type = category;
  }

  // 🐉 Monster filters (chỉ khi là monster)
  if (category === TYPE_CARDS.MONSTER) {
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
  if (category === TYPE_CARDS.SPELL && spellType) {
    query.spellType = spellType;
  }

  // 🪤 Trap filter
  if (category === TYPE_CARDS.TRAP && trapType) {
    query.trapType = trapType;
  }

  // 🚫 Card limit status filter
  if (cardLimitStatus !== undefined) {
    query.cardLimitStatus = cardLimitStatus;
  }

  const sortOption: any = {};
  sortOption.activeStatus = -1;
  sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

  const [data, total] = await Promise.all([
    Card.find(query).sort(sortOption).skip(skip).limit(limit).lean(),
    Card.countDocuments(query),
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

const setStatusCardService = async (Card: Model<ICard>, {
  code,
  cardLimitStatus,
  activeStatus,
}: requestCardSetStatus) => {
  const card = await Card.findOneAndUpdate(
    { code },
    { cardLimitStatus, activeStatus },
    { new: true },
  );

  if (!card) {
    return throwError("Card not found", 404);
  }
  // emitRefreshConfig();

  return card;
};

const syncCardStatusFromSheetService = async (Card: Model<ICard>, {
  sheetUrl,
  gid,
  type,
}: SyncCardStatusFromSheetPayload, user: JwtPayload, reqInfo?: ReqInfor) => {
  try {
    if (!sheetUrl || gid === undefined) {
      return throwError("Missing sheetUrl or gid", STATUS_CODES.BAD_REQUEST);
    }

    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      return throwError("Invalid Google Sheet URL", STATUS_CODES.BAD_REQUEST);
    }

    const sheetId = match[1];
    const sheets = getGoogleSheetsClient();

    const metaRes = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const sheetMeta = metaRes.data.sheets?.find(
      (s) => s.properties?.sheetId === Number(gid),
    );

    if (!sheetMeta) {
      return throwError(`Not found gid with value "${gid}"`, STATUS_CODES.NOT_FOUND);
    }

    const tabName = sheetMeta.properties?.title!;

    const dataRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tabName}!A:D`,
    });

    const rows = dataRes.data.values ?? [];
    const [_header, ...dataRows] = rows;

    const results = {
      updated: [] as string[],
      skipped: [] as string[],
      notFound: [] as string[],
      errors: [] as string[],
    };

    const isActivateType = type === "ACTIVATE_STATUS";
    const validValues = isActivateType ? [0, 1] : [0, 1, 2, 3];
    const updateField = isActivateType ? "activeStatus" : "cardLimitStatus";

    // Bước 1: lọc và validate trước, KHÔNG đụng DB trong bước này
    type ParsedRow = { rowIndex: number; code: string; parsedStatus: number };
    const validRows: ParsedRow[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const [name, code, status, banish] = dataRows[i];
      const rawValue = isActivateType ? status : banish;
      if (!code || rawValue === undefined) continue;

      if (rawValue?.trim() === "-1") {
        results.skipped.push(code);
        continue;
      }

      const parsedStatus = parseInt(rawValue);
      if (isNaN(parsedStatus) || !validValues.includes(parsedStatus)) {
        results.errors.push(
          `${code}: invalid status "${rawValue}" (chỉ chấp nhận ${validValues.join(", ")})`,
        );
        continue;
      }

      validRows.push({ rowIndex: i + 2, code, parsedStatus });
    }

    // Bước 2: 1 lần fetch TẤT CẢ card liên quan, thay vì fetch từng cái
    const codes = validRows.map((r) => r.code);
    const existingCards = await Card.find({ code: { $in: codes } })
      .select("code activeStatus cardLimitStatus")
      .lean();
    const cardMap = new Map(existingCards.map((c) => [c.code, c]));

    // Bước 3: gom các thay đổi thật sự cần update thành bulkWrite
    const bulkOps: any[] = [];
    const notFoundRowIndexes: number[] = [];

    for (const row of validRows) {
      const card = cardMap.get(row.code);

      if (!card) {
        results.notFound.push(row.code);
        notFoundRowIndexes.push(row.rowIndex);
        continue;
      }

      if (card[updateField] === row.parsedStatus) {
        results.skipped.push(row.code);
        continue;
      }

      bulkOps.push({
        updateOne: {
          filter: { code: row.code },
          update: { $set: { [updateField]: row.parsedStatus } },
        },
      });
      results.updated.push(row.code);
    }

    // Bước 4: 1 lần ghi TẤT CẢ thay đổi, thay vì từng updateOne riêng lẻ
    if (bulkOps.length > 0) {
      await Card.bulkWrite(bulkOps);
    }

    if (notFoundRowIndexes.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          valueInputOption: "RAW",
          data: notFoundRowIndexes.map((rowIndex) => ({
            range: `${tabName}!C${rowIndex}`,
            values: [["-1"]],
          })),
        },
      });
    }

    await createActivityLogService({
      userId: user._id.toString(),
      username: user.username,
      action: "SYNC_CARD_STATUS",
      targetType: "CARD",
      targetId: sheetUrl,
      targetName: tabName,
      message: `${user.username} synced card status from sheet ${sheetUrl} (updated: ${results.updated.length}, skipped: ${results.skipped.length}, not found: ${results.notFound.length}, errors: ${results.errors.length})`,
      ip: reqInfo?.ip,
      userAgent: reqInfo?.userAgent,
      metadata: { sheetUrl, gid, type, results },
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
  } catch (error: any) {
    throw error;
  }
};

export {
  getAllCards,
  searchCards,
  setStatusCardService,
  syncCardStatusFromSheetService,
};
