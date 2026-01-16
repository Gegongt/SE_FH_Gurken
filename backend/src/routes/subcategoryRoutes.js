const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const subcategoryController = require("../controllers/subcategoryController");

/**
 * @swagger
 * /subcategories:
 *   get:
 *     tags: [Subcategory]
 *     summary: Get all subcategories
 *     description: Returns a list of all subcategories.
 *     responses:
 *       200:
 *         description: List of subcategories
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
router.get("/", requireAuth, checkBlocked, subcategoryController.list);

module.exports = router;