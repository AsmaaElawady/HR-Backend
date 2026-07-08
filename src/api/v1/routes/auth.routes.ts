import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { validate } from "../../../shared/middleware/validate";
import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from "../validators/auth.validator";
import { authenticate } from "../../../shared/middleware/authenticate";
import { authorize } from "../../../shared/middleware/authorize";

const router = Router();
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get tokens
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful — returns accessToken and refreshToken
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), authController.login);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns new accessToken
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/refresh", validate(refreshSchema), authController.refresh);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new HR user (admin only)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       403:
 *         description: Not authorized
 */
router.post(
    "/register",
    authenticate,
    authorize("admin"),
    validate(registerSchema),
    authController.register
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Not authenticated
 */
router.get("/me", authenticate, authController.getMe);

/**
 * @swagger
 * /auth/changePassword:
 *   patch:
 *     summary: Change the current user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "OldPassword@123"
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword@456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Not authenticated
 */
router.patch("/changePassword", authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;