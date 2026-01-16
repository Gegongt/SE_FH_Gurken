const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const requireAuth = require("../middlewares/requireAuth");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Firebase + DB)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "max@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "test1234"
 *               name:
 *                 type: string
 *                 example: "Max Mustermann"
 *               profilepicturename:
 *                 type: string
 *                 nullable: true
 *                 description: Optional filename (null or omitted => default null)
 *                 example: null
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: Firebase UID
 *                   example: "abc123firebaseuid"
 *                 accessToken:
 *                   type: string
 *                   description: Firebase ID token (valid ~1h)
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: number
 *                   example: 3600
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing email/password/name"
 *       401:
 *         description: Firebase rejected credentials (e.g. weak password, email already exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user (Firebase)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "max@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "test1234"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: Firebase UID
 *                   example: "abc123firebaseuid"
 *                 accessToken:
 *                   type: string
 *                   description: Firebase ID token (valid ~1h)
 *                 refreshToken:
 *                   type: string
 *                 expiresIn:
 *                   type: number
 *                   example: 3600
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing email/password"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/login", authController.login);

module.exports = router;