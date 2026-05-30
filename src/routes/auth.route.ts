import router from "express";
import { loginController, registerController, getProfileController, logoutController, uploadAvatarController, changePasswordController } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";
const authRoute = router.Router();

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
authRoute.post("/register", registerController);


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
authRoute.post("/login", loginController);


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
authRoute.get("/profile", authMiddleware, getProfileController);

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
authRoute.get("/logout", authMiddleware, logoutController);

/**
 * @swagger
 * /api/v1/auth/upload-avatar:
 *   post:
 *     summary: Upload account avatar
 *     tags: [Account Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload 
 *     responses:
 *       200:
 *         description: Upload avatar successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật ảnh đại diện thành công!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                 avatar:
 *                   type: string
 *                   example: https://res.cloudinary.com/demo/image/upload/v123456/avatars/abc.jpg
 *       400:
 *         description: Bad Request (Missing file or invalid format)
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
authRoute.post(
    "/upload-avatar",
    authMiddleware,
    uploadMiddleware.single("avatar"),
    uploadAvatarController
);


/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change password account
 *     tags: [Account Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 123456
 *               newPassword:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */
authRoute.post("/change-password", authMiddleware, changePasswordController);

export default authRoute;