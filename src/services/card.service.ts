import {
  CARD_ACTIVATE_STATUS,
  requestCardSetStatus,
  SearchCardOptions,
  SyncCardStatusFromSheetPayload,
  TYPE_CARDS,
} from "../types/cards";
import { PaginationOptions } from "../types/common";
import Card from "../models/card";
import throwError from "../utils/throwError";
import { STATUS_CODES } from "../constants/status-codes.";
import { getGoogleSheetsClient } from "../helpers/googleSheet.helpers";

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

  // 🔍 Search name
  if (name) {
    query.name = { $regex: name, $options: "i" };
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

  return card;
};

const syncCardStatusFromSheetService = async ({
  sheetUrl,
  gid,
}: SyncCardStatusFromSheetPayload) => {
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

    // Lấy tên tab từ gid
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

    // Đọc data từ đúng tab
    const dataRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tabName}!A:C`,
    });

    const rows = dataRes.data.values ?? [];
    const [_header, ...dataRows] = rows;

    const results = {
      updated: [] as string[],
      skipped: [] as string[],
      notFound: [] as string[],
      errors: [] as string[],
    };

    for (let i = 0; i < dataRows.length; i++) {
      const [name, code, status] = dataRows[i];
      if (!code || status === undefined) continue;

      const activeStatus = parseInt(status) as CARD_ACTIVATE_STATUS;

      if (isNaN(activeStatus) || ![0, 1].includes(activeStatus)) {
        results.errors.push(
          `${code}: invalid status "${status}" (chỉ chấp nhận 0 hoặc 1)`,
        );
        continue;
      }

      // Tìm card và so sánh trước
      const card = await Card.findOne({ code }).lean();

      if (!card) {
        results.notFound.push(code);
        continue;
      }

      // Giống nhau thì bỏ qua
      if (card.activeStatus === activeStatus) {
        results.skipped.push(code);
        continue;
      }

      // Khác nhau thì mới update
      await Card.updateOne({ code }, { $set: { activeStatus } });
      results.updated.push(code);
    }

    return {
      message: "Sync completed",
      tab: tabName,
      gid,
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
