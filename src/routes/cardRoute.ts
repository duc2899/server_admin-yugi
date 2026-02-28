import router from "express";
import {
  getAllCardsController,
  searchCardsController,
} from "../controllers/cardController";

const cardRoute = router.Router();

/**
 * @swagger
 * /api/v1/cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Cards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Limit response
 *
 *     responses:
 *       200:
 *         description: Success
 */
cardRoute.get("/", getAllCardsController);

/**
 * @swagger
 * /api/v1/cards/search:
 *   get:
 *     summary: Search cards multi
 *     tags: [Search Cards]
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
 *         name: level
 *         schema:
 *           type: number
 *         required: false
 *         description: Level of monster
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
 *         required: false
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Limit response
 * 
 *     responses:
 *       200:
 *         description: Success
 */
cardRoute.get("/search", searchCardsController);

export default cardRoute;
