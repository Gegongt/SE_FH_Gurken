const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const upload = require("../middlewares/uploadSingle");
const fileController = require("../controllers/fileController");

/**
 * @swagger
 * /files:
 *   post:
 *     tags: [File]
 *     summary: Upload a file (single)
 *     description: >
 *       Creates a DB entry and uploads a single file using multipart/form-data.
 *       The uploader is taken from the authenticated user (uploaderId is not provided by the client).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - subcategoryid
 *               - file
 *             properties:
 *               subcategoryid:
 *                 type: integer
 *                 example: 3
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 subcategoryid:
 *                   type: integer
 *                   example: 3
 *                 name:
 *                   type: string
 *                   example: "Script.sql"
 *                 isreported:
 *                   type: boolean
 *                   example: false
 *                 uploaderid:
 *                   type: interger
 *                   example: 4
 *       400:
 *         description: Missing/invalid fields (subcategoryId or file)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       500:
 *         description: Internal server error
 */

router.post("/", requireAuth, checkBlocked, upload.single("file"), fileController.create);

/**
 * @swagger
 * /files:
 *   get:
 *     tags: [File]
 *     summary: Get files (optionally filtered)
 *     description: >
 *       Returns all files. You can optionally filter by `subcategoryId` or by `reported` (true/false).
 *       If both are provided, the backend should decide which one takes precedence (recommended: reject with 400 or document precedence).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subcategoryId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter files by subcategory id
 *         example: 3
 *       - in: query
 *         name: reported
 *         required: false
 *         schema:
 *           type: boolean
 *         description: Filter files by reported status
 *         example: true
 *     responses:
 *       200:
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   subcategoryid:
 *                     type: integer
 *                     example: 3
 *                   name:
 *                     type: string
 *                     example: "Script.sql"
 *                   isreported:
 *                     type: boolean
 *                     example: true
 *                   uploader:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *                       email:
 *                         type: string
 *                         example: "filiplukic9@gmail.com"
 *                       name:
 *                         type: string
 *                         example: "lelek"
 *                       isadmin:
 *                         type: boolean
 *                         example: true
 *                       isblocked:
 *                         type: boolean
 *                         example: false
 *                       profilepicturename:
 *                         type: string
 *                         nullable: true
 *                         example: "s"
 *       400:
 *         description: Invalid query parameters (subcategoryId must be positive integer, reported must be true/false)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, fileController.list);

module.exports = router;