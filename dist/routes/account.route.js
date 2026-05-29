"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const account_controller_1 = require("../controllers/account.controller");
const roleMiddleware_1 = __importDefault(require("../middlewares/roleMiddleware"));
const accountAdmin_1 = require("../models/accountAdmin");
const cache_middleware_1 = require("../middlewares/cache.middleware");
const accountRoute = express_1.default.Router();
/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: key
 *         schema:
 *           type: string
 *         required: false
 *         description: Key search displayName, email and code
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
accountRoute.get("/", auth_middleware_1.default, (0, roleMiddleware_1.default)(accountAdmin_1.RoleAccount.ADMIN, accountAdmin_1.RoleAccount.NORMAL), (0, cache_middleware_1.cacheMiddleware)({
    ttl: 5,
    prefix: "accounts-list",
    tag: "accounts",
    skipAuth: true,
}), account_controller_1.fetchAllAccounts);
exports.default = accountRoute;
