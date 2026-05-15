import {
  requestCardSetStatus,
  SearchCardOptions,
  SyncCardStatusFromSheetPayload,
  TYPE_CARDS,
} from "../types/cards";
import { JwtPayload, PaginationOptions, ReqInfor } from "../types/common";
import Card from "../models/card";
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes.";
import { getGoogleSheetsClient } from "../helpers/googleSheet.helpers";
import { createActivityLogService } from "./activityLog.service";
import { emitRefreshConfig } from "../configs/socket";

const getAllCards = async ({ page = 1, limit = 10 }: PaginationOptions) => {
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

const searchCards = async (options: SearchCardOptions) => {
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

const setStatusCardService = async ({
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

const syncCardStatusFromSheetService = async ({
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
      return throwError(
        `Not found gid with value "${gid}"`,
        STATUS_CODES.NOT_FOUND,
      );
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

    // Ngoài for - chuẩn bị track row notFound
    const notFoundRowIndexes: number[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const [name, code, status, banish] = dataRows[i];
      const rawValue = isActivateType ? status : banish;
      if (!code || rawValue === undefined) continue;
      if (code === -1) continue;

      // Thêm vào đây
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

      const card = await Card.findOne({ code })
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

      await Card.updateOne({ code }, { $set: { [updateField]: parsedStatus } });
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
