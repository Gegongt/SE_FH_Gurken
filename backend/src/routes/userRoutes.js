const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const userController = require("../controllers/userController")

const router = express.Router();

/**
 * @swagger
 * /api/user/create:
 *   post:
 *     summary: Creates the authenticated user in the database (id = Firebase UID)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               profilepicturename:
 *                 type: string
 *                 nullable: true
 *                 description: Optional profile picture filename (null or omitted => default null)
 *             required:
 *               - name
 *           example:
 *             name: "Max Mustermann"
 *             profilepicturename: null
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Firebase UID (Primary Key)
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     isadmin:
 *                       type: boolean
 *                       default: false
 *                     isblocked:
 *                       type: boolean
 *                       default: false
 *                     profilepicturename:
 *                       type: string
 *                       nullable: true
 *                   required:
 *                     - id
 *                     - email
 *                     - name
 *                     - isadmin
 *                     - isblocked
 *                     - profilepicturename
 *       200:
 *         description: User already exists (idempotent create)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: boolean
 *                   example: false
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     isadmin:
 *                       type: boolean
 *                     isblocked:
 *                       type: boolean
 *                     profilepicturename:
 *                       type: string
 *                       nullable: true
 */
router.post("/create", requireAuth, userController.create);

/**
 * @swagger
 * /api/user/whoami:
 *   get:
 *     summary: Returns the currently authenticated user (from DB)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Firebase UID (Primary Key)
 *                     email:
 *                       type: string
 *                       format: email
 *                     name:
 *                       type: string
 *                     isadmin:
 *                       type: boolean
 *                       default: false
 *                     isblocked:
 *                       type: boolean
 *                       default: false
 *                     profilepicturename:
 *                       type: string
 *                       nullable: true
 *                   required:
 *                     - id
 *                     - email
 *                     - name
 *                     - isadmin
 *                     - isblocked
 *                     - profilepicturename
 */
router.get("/whoami", requireAuth, userController.whoami);

module.exports = router;