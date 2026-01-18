const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const ratingController = require("../controllers/ratingController");

/**
 * @swagger
 * /ratings:
 *   post:
 *     tags: [Rating]
 *     summary: Create a rating (one per user per file)
 *     description: >
 *       Creates a rating for a file. The userId is taken from the authenticated user (not from the request body).
 *       Exactly one of rating flags must be true: ratingisbad, ratingismedium, ratingisgood.
 *       A user can only rate a file once.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileid
 *               - ratingisbad
 *               - ratingismedium
 *               - ratingisgood
 *             properties:
 *               fileid:
 *                 type: integer
 *                 example: 2
 *               ratingisbad:
 *                 type: boolean
 *                 example: false
 *               ratingismedium:
 *                 type: boolean
 *                 example: false
 *               ratingisgood:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Rating created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 7
 *                 userid:
 *                   type: string
 *                   example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *                 fileid:
 *                   type: integer
 *                   example: 2
 *                 ratingisbad:
 *                   type: boolean
 *                   example: false
 *                 ratingismedium:
 *                   type: boolean
 *                   example: false
 *                 ratingisgood:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid body (missing fields, not booleans, or not exactly one true)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       409:
 *         description: User already rated this file
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAuth, checkBlocked, ratingController.create);

/**
 * @swagger
 * /ratings:
 *   get:
 *     tags: [Rating]
 *     summary: Get ratings for a file
 *     description: Returns all ratings for the given fileId. Query param may be camelCase. Response fields are lower case.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *         description: File id
 *         example: 2
 *     responses:
 *       200:
 *         description: List of ratings for the file
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 7
 *                   userid:
 *                     type: string
 *                     example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *                   fileid:
 *                     type: integer
 *                     example: 2
 *                   ratingisbad:
 *                     type: boolean
 *                     example: false
 *                   ratingismedium:
 *                     type: boolean
 *                     example: false
 *                   ratingisgood:
 *                     type: boolean
 *                     example: true
 *       400:
 *         description: Missing/invalid fileId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, ratingController.listByFile);

/**
 * @swagger
 * /ratings/{ratingId}:
 *   put:
 *     tags: [Rating]
 *     summary: Update a rating (only owner)
 *     description: >
 *       Updates the rating value (enum) of a rating. Only the owner (userid) can update their rating.
 *       Admins cannot update ratings of other users.
 *       Only the rating flags are updated; id, userid and fileid remain unchanged.
 *       Body params must be lower case.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Rating id
 *         example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ratingisbad
 *               - ratingismedium
 *               - ratingisgood
 *             properties:
 *               ratingisbad:
 *                 type: boolean
 *                 example: false
 *               ratingismedium:
 *                 type: boolean
 *                 example: true
 *               ratingisgood:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Rating updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 7
 *                 userid:
 *                   type: string
 *                   example: "1WEAjHYMHOYeMegeMKZlhMwMgEm2"
 *                 fileid:
 *                   type: integer
 *                   example: 2
 *                 ratingisbad:
 *                   type: boolean
 *                   example: false
 *                 ratingismedium:
 *                   type: boolean
 *                   example: true
 *                 ratingisgood:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Invalid ratingId or invalid body (missing fields / not booleans / not exactly one true)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner)
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
router.put("/:ratingId", requireAuth, checkBlocked, ratingController.update);

/**
 * @swagger
 * /ratings/{ratingId}:
 *   delete:
 *     tags: [Rating]
 *     summary: Delete a rating (owner or admin)
 *     description: Deletes a rating. The owner can delete their own rating, admins can delete ratings of other users as well.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Rating id
 *         example: 7
 *     responses:
 *       204:
 *         description: Rating deleted
 *       400:
 *         description: Invalid ratingId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not owner/admin)
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:ratingId", requireAuth, checkBlocked, ratingController.remove);


module.exports = router;