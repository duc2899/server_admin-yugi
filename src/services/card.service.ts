import { SearchCardOptions, TYPE_CARDS } from "../types/cards";
import { PaginationOptions } from "../types/common";
import Card from "../models/card";

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

export { getAllCards, searchCards };
