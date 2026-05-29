"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const card_controller_1 = require("../controllers/card.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const cache_middleware_1 = require("../middlewares/cache.middleware");
const clearCacheAfter_middleware_1 = require("../middlewares/clearCacheAfter.middleware");
const roleMiddleware_1 = __importDefault(require("../middlewares/roleMiddleware"));
const accountAdmin_1 = require("../models/accountAdmin");
const cardRoute = express_1.default.Router();
/**
 * @swagger
 * /api/v1/cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         required: false
 *         description: Limit response
 *
 *     responses:
 *       200:
 *         description: Success
 */
cardRoute.get("/", auth_middleware_1.default, (0, cache_middleware_1.cacheMiddleware)({
    ttl: 15,
    prefix: "cards-list",
    tag: "cards",
    skipAuth: true,
}), card_controller_1.getAllCardsController);
/**
 * @swagger
 * /api/v1/cards/search:
 *   get:
 *     summary: Search cards multi
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Name of card
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           default: MONSTER
 *         required: false
 *         description: Type of card
 *
 *       - in: query
 *         name: monsterType
 *         schema:
 *           type: string
 *         required: false
 *         description: Type of monster
 *
 *       - in: query
 *         name: monsterAttribute
 *         schema:
 *           type: string
 *         required: false
 *         description: Attribute of monster
 *
 *       - in: query
 *         name: monsterCategory
 *         schema:
 *           type: string
 *         required: false
 *         description: Category of monster
 *
 *       - in: query
 *         name: gte
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter monsters with level greater than or equal to this value
 *
 *       - in: query
 *         name: lte
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter monsters with level less than or equal to this value
 *
 *       - in: query
 *         name: atk
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter monsters with atk equal to this value
 *
 *       - in: query
 *         name: def
 *         schema:
 *           type: number
 *         required: false
 *         description: Filter monsters with def equal to this value
 *
 *       - in: query
 *         name: spellType
 *         schema:
 *           type: string
 *         required: false
 *         description: Spell type
 *
 *       - in: query
 *         name: trapType
 *         schema:
 *           type: string
 *         required: false
 *         description: Trap type
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         required: false
 *         description: Sort by name, atk, def or level
 *
 *       - in: query
 *         name: cardLimitStatus
 *         schema:
 *           type: number
 *         required: false
 *         description: Card limit status
 *
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *         required: false
 *         description: Sort order (asc or desc)
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         required: false
 *         description: Limit response
 *
 *     responses:
 *       200:
 *         description: Success
 */
cardRoute.get("/search", auth_middleware_1.default, (0, cache_middleware_1.cacheMiddleware)({
    ttl: 5,
    prefix: "cards-search",
    tag: "cards",
    skipAuth: true,
}), card_controller_1.searchCardsController);
/**
 * @swagger
 * /api/v1/cards/set-status:
 *   post:
 *     summary: Set status of a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - status
 *             properties:
 *               code:
 *                 type: string
 *                 example: abcwq
 *               status:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Change status successfully
 */
cardRoute.post("/set-status", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), (0, clearCacheAfter_middleware_1.clearCacheAfterSuccess)("cards"), card_controller_1.setCardStatusController);
/**
 * @swagger
 * /api/v1/cards/sync-status:
 *   post:
 *     summary: Sync card status from a Google Sheet
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sheetUrl
 *               - gid
 *               - type
 *             properties:
 *               sheetUrl:
 *                 type: string
 *                 example: https://docs.google.com/spreadsheets/d/...
 *               gid:
 *                 type: string
 *                 example: Sheet1
 *               type:
 *                 type: string
 *                 example: ACTIVATE_STATUS
 *     responses:
 *       200:
 *         description: Change status successfully
 */
cardRoute.post("/sync-status", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), (0, clearCacheAfter_middleware_1.clearCacheAfterSuccess)("cards"), card_controller_1.syncCardStatusFromSheetController);
exports.default = cardRoute;
