import router from "express";
import {
  getAllCardsController,
  searchCardsController,
  setCardStatusController,
  syncCardStatusFromSheetController,
} from "../controllers/card.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { cacheMiddleware } from "../middlewares/cache.middleware";
import { clearCacheAfterSuccess } from "../middlewares/clearCacheAfter.middleware";

const cardRoute = router.Router();

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
cardRoute.get(
  "/",
  authMiddleware,
  cacheMiddleware({
    ttl: 15,
    prefix: "cards-list",
    tag: "cards",
    skipAuth: true,
  }),
  getAllCardsController
);

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
cardRoute.get(
  "/search",
  authMiddleware,
  cacheMiddleware({
    ttl: 5,
    prefix: "cards-search",
    tag: "cards",
    skipAuth: true,
  }),
  searchCardsController
);

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
cardRoute.post(
  "/set-status",
  authMiddleware,
  clearCacheAfterSuccess("cards"),
  setCardStatusController
);

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
 *             properties:
 *               sheetUrl:
 *                 type: string
 *                 example: https://docs.google.com/spreadsheets/d/...
 *               gid:
 *                 type: string
 *                 example: Sheet1
 *     responses:
 *       200:
 *         description: Change status successfully
 */
cardRoute.post(
  "/sync-status",
  authMiddleware,
  clearCacheAfterSuccess("cards"),
  syncCardStatusFromSheetController
);


export default cardRoute;
