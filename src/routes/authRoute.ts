import router from "express";
import { loginController, registerController } from "../controllers/authController";
const authRoute = router.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register Account Admin
 *     tags: [Accounts Admin]
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
authRoute.post("/register", registerController);


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login Account Admin
 *     tags: [Accounts Admin]
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
authRoute.post("/login", loginController);

export default authRoute;