const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const requireVerifiedEmail = require("../middlewares/requireVerifiedEmail")
const favouriteController = require("../controllers/favouriteController");

/**
 * @swagger
 * /favourites:
 *   get:
 *     tags: [Favourite]
 *     summary: Get favourites of a user (self or admin)
 *     description: Returns favourites for the given userId. Only the user themself or an admin can call this.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User id (Firebase UID)
 *         example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *     responses:
 *       200:
 *         description: List of favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userid:
 *                     type: string
 *                     example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *                   fileid:
 *                     type: integer
 *                     example: 2
 *       400:
 *         description: Missing userId query param
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not self/admin or blocked user)
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     tags: [Favourite]
 *     summary: Add a favourite (self or admin)
 *     description: Adds a file as favourite for a user. A file can only be favourited once per user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userid, fileid]
 *             properties:
 *               userid:
 *                 type: string
 *                 example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *               fileid:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Favourite created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userid:
 *                   type: string
 *                   example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *                 fileid:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Missing/invalid body fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not self/admin or blocked user)
 *       409:
 *         description: Favourite already exists
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags: [Favourite]
 *     summary: Remove a favourite (self or admin)
 *     description: Removes a favourite entry by userId and fileId. Only the user themself or an admin can call this.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userid, fileid]
 *             properties:
 *               userid:
 *                 type: string
 *                 example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *               fileid:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       204:
 *         description: Favourite removed
 *       400:
 *         description: Missing/invalid body fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not self/admin or blocked user)
 *       404:
 *         description: Favourite not found
 *       500:
 *         description: Internal server error
 */

router.get("/", requireAuth, checkBlocked, requireVerifiedEmail, favouriteController.list);
router.post("/", requireAuth, checkBlocked, requireVerifiedEmail, favouriteController.create);
router.delete("/", requireAuth, checkBlocked, requireVerifiedEmail, favouriteController.remove);

module.exports = router;