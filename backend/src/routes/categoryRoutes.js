const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const requireVerifiedEmail = require("../middlewares/requireVerifiedEmail")
const categoryController = require("../controllers/categoryController");

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Category]
 *     summary: Get all categories
 *     description: Returns a list of all categories.
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Sports"
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, requireVerifiedEmail, categoryController.list);

module.exports = router;