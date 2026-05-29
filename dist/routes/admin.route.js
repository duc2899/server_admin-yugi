"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const roleMiddleware_1 = __importDefault(require("../middlewares/roleMiddleware"));
const accountAdmin_1 = require("../models/accountAdmin");
const cache_middleware_1 = require("../middlewares/cache.middleware");
const clearCacheAfter_middleware_1 = require("../middlewares/clearCacheAfter.middleware");
const deckAdmin_controller_1 = require("../controllers/deckAdmin.controller");
const activityLog_controller_1 = require("../controllers/activityLog.controller");
const adminRoute = express_1.default.Router();
/**
 * @swagger
 * /api/v1/admin/change-role:
 *   post:
 *     summary: Change Role
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *               - role
 *             properties:
 *               _id:
 *                 type: string
 *                 example: abcwq
 *               role:
 *                 type: string
 *                 example: normal
 *     responses:
 *       200:
 *         description: Change role successfully
 */
adminRoute.post("/change-role", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), (0, clearCacheAfter_middleware_1.clearCacheAfterSuccess)("accounts-admin"), admin_controller_1.changeRoleController);
/**
 * @swagger
 * /api/v1/admin/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: false
 *         description: Key search fullName, username and code
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
adminRoute.get("/accounts", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), (0, cache_middleware_1.cacheMiddleware)({
    ttl: 5,
    prefix: "accounts-admin-list",
    tag: "accounts-admin",
    skipAuth: true,
}), admin_controller_1.getAllAccountsController);
/**
 * @swagger
 * /api/v1/admin/get-version-client:
 *   get:
 *     summary: Get version client
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
adminRoute.get("/get-version-client", auth_middleware_1.default, (0, cache_middleware_1.cacheMiddleware)({
    ttl: 30,
    prefix: "version-client",
    tag: "version-client",
    skipAuth: true,
}), admin_controller_1.getVersionClientController);
/**
 * @swagger
 * /api/v1/admin/set-version-client:
 *   post:
 *     summary: Set version client
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - version
 *               - type
 *             properties:
 *               version:
 *                 type: string
 *                 example: 0.107
 *               type:
 *                 type: string
 *                 example: CLIENT_VERSION_DEV
 *     responses:
 *       200:
 *         description: Change version successfully
 */
adminRoute.post("/set-version-client", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), (0, clearCacheAfter_middleware_1.clearCacheAfterSuccess)("version-client"), admin_controller_1.setVersionClientController);
/**
 * @swagger
 * /api/v1/admin/toggle-ban:
 *   post:
 *     summary: Toggle Ban
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - _id
 *             properties:
 *               _id:
 *                 type: string
 *                 example: abcwq
 *     responses:
 *       200:
 *         description: Toggle ban successfully
 */
adminRoute.post("/toggle-ban", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), (0, clearCacheAfter_middleware_1.clearCacheAfterSuccess)("accounts-admin"), admin_controller_1.toggleBanUserController);
/**
 * @swagger
 * /api/v1/admin/create-deck:
 *   post:
 *     summary: Create deck
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - mainDeckCards
 *               - sideDeckCards
 *               - extraDeckCards
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hello
 *               type:
 *                 type: string
 *                 example: DEFAULT
 *               mainDeckCards:
 *                 type: array
 *                 example: []
 *               sideDeckCards:
 *                 type: array
 *                 example: []
 *               extraDeckCards:
 *                 type: array
 *                 example: []
 *     responses:
 *       200:
 *         description: Toggle ban successfully
 */
adminRoute.post("/create-deck", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), deckAdmin_controller_1.createDeckController);
/**
 * @swagger
 * /api/v1/admin/get-decks:
 *   get:
 *     summary: Get All Deck
 *     tags: [Services Admin]
 *     responses:
 *       200:
 *         description: Success
 */
adminRoute.get("/get-decks", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN, accountAdmin_1.RoleAccount.NORMAL), deckAdmin_controller_1.getAllDeckController);
/**
 * @swagger
 * /api/v1/admin/get-deck/{id}:
 *   get:
 *     summary: Get deck detail
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deck ID
 *     responses:
 *       200:
 *         description: Success
 */
adminRoute.get("/get-deck/:id", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN, accountAdmin_1.RoleAccount.NORMAL), deckAdmin_controller_1.getDeckAdminDetailController);
/**
 * @swagger
 * /api/v1/admin/delete-deck:
 *   post:
 *     summary: Delete deck
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: 7451186054687625216
 *         description: Deck ID
 *     responses:
 *       200:
 *         description: Success
 */
adminRoute.post("/delete-deck", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), deckAdmin_controller_1.deleteDeckAdminController);
/**
 * @swagger
 * /api/v1/admin/save-deck:
 *   post:
 *     summary: Save deck
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - type
 *               - mainDeckCards
 *               - sideDeckCards
 *               - extraDeckCards
 *             properties:
 *               id:
 *                 type: string
 *                 example: 7451186054687625216
 *               name:
 *                 type: string
 *                 example: Hello
 *               type:
 *                 type: string
 *                 example: DEFAULT
 *               mainDeckCards:
 *                 type: array
 *                 example: []
 *               sideDeckCards:
 *                 type: array
 *                 example: []
 *               extraDeckCards:
 *                 type: array
 *                 example: []
 *     responses:
 *       200:
 *         description: Save deck successfully
 */
adminRoute.post("/save-deck", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN), deckAdmin_controller_1.saveDeckController);
/**
 * @swagger
 * /api/v1/admin/logs:
 *   get:
 *     summary: Get activity logs
 *     tags: [Services Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         required: false
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *         required: false
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *         required: false
 *
 *     responses:
 *       200:
 *         description: Success
 */
adminRoute.get("/get-logs", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN, accountAdmin_1.RoleAccount.NORMAL), activityLog_controller_1.getActivityLogsController);
exports.default = adminRoute;
