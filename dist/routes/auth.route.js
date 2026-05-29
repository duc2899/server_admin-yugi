"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const authRoute = express_1.default.Router();
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register Account Admin
 *     tags: [Account Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullName
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               fullName:
 *                 type: string
 *                 example: Nguyen Van A
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Admin account created successfully
 *       400:
 *         description: Username already exists
 */
authRoute.post("/register", auth_controller_1.registerController);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login Account Admin
 *     tags: [Account Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Admin account logged in successfully
 *       400:
 *         description: Invalid username or password
 */
authRoute.post("/login", auth_controller_1.loginController);
/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get profile account
 *     tags: [Account Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
authRoute.get("/profile", auth_middleware_1.default, auth_controller_1.getProfileController);
/**
 * @swagger
 * /api/v1/auth/logout:
 *   get:
 *     summary: Logout account
 *     tags: [Account Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
authRoute.get("/logout", auth_middleware_1.default, auth_controller_1.logoutController);
exports.default = authRoute;
