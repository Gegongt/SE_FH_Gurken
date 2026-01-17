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
 *     summary: Get subcategories (optionally filtered by category)
 *     description: Returns a list of all subcategories. If `categoryId` is provided, only subcategories of that category are returned.
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter subcategories by category id
 *         example: 3
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
 *                   categoryId:
 *                     type: integer
 *                     example: 3
 *                   name:
 *                     type: string
 *                     example: "Sports"
 *       400:
 *         description: Invalid categoryId (must be a positive integer)
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, subcategoryController.list);

module.exports = router;