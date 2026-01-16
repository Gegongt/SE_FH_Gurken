const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const userController = require("../controllers/userController");
const checkBlocked = require("../middlewares/checkBlocked");

const router = express.Router();

/**
 * @swagger
 * /users/whoami:
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
router.get("/whoami", requireAuth, checkBlocked, userController.whoami);

/**
 * @swagger
 * /users:
 *   put:
 *     tags: [User]
 *     summary: Update own user
 *     description: Updates the authenticated user's profile. `isblocked` is only applied if caller is admin.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - profilepicturename
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Max Mustermann"
 *               profilepicturename:
 *                 type: string
 *                 nullable: true
 *                 example: "avatar.png"
 *               isblocked:
 *                 type: boolean
 *                 description: Admin only. If provided by non-admin, it is ignored.
 *                 example: false
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "firebaseUid123"
 *                 email:
 *                   type: string
 *                   example: "max@example.com"
 *                 name:
 *                   type: string
 *                   example: "Max Mustermann"
 *                 isadmin:
 *                   type: boolean
 *                   example: false
 *                 isblocked:
 *                   type: boolean
 *                   example: false
 *                 profilepicturename:
 *                   type: string
 *                   nullable: true
 *                   example: "avatar.png"
 *       400:
 *         description: Missing/invalid body fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/", requireAuth, checkBlocked, userController.update)

/**
 * @swagger
 * /users/{userId}:
 *   put:
 *     tags: [User]
 *     summary: Update user by id (self or admin)
 *     description: Updates the user with the given userId. Caller can update only themselves unless admin. `isblocked` is admin-only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "firebaseUid123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - profilepicturename
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Max Mustermann"
 *               profilepicturename:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               isblocked:
 *                 type: boolean
 *                 description: Admin only. If provided by non-admin, it is ignored.
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "firebaseUid123"
 *                 email:
 *                   type: string
 *                   example: "max@example.com"
 *                 name:
 *                   type: string
 *                   example: "Max Mustermann"
 *                 isadmin:
 *                   type: boolean
 *                   example: true
 *                 isblocked:
 *                   type: boolean
 *                   example: false
 *                 profilepicturename:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Missing/invalid body fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not self, not admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/:userId", requireAuth, checkBlocked, userController.update)

/**
 * @swagger
 * /users:
 *   delete:
 *     tags: [User]
 *     summary: Delete own user
 *     description: Deletes the authenticated user (self delete).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/", requireAuth, userController.remove);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user by id (admin only for other users)
 *     description: >
 *       Deletes the user with the given userId. Caller can delete only themselves unless admin.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "firebaseUid123"
 *     responses:
 *       204:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not self, not admin)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:userId", requireAuth, userController.remove);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [User]
 *     summary: List users filtered by blocked status (admin only)
 *     description: Returns all users filtered by the `isBlocked` query parameter. Admin only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isBlocked
 *         required: true
 *         schema:
 *           type: boolean
 *         description: Filter users by blocked status
 *         example: true
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "firebaseUid123"
 *                   email:
 *                     type: string
 *                     example: "max@example.com"
 *                   name:
 *                     type: string
 *                     example: "Max Mustermann"
 *                   isadmin:
 *                     type: boolean
 *                     example: false
 *                   isblocked:
 *                     type: boolean
 *                     example: true
 *                   profilepicturename:
 *                     type: string
 *                     nullable: true
 *                     example: "avatar.png"
 *       400:
 *         description: Missing or invalid query parameter (isBlocked must be true/false)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, userController.list);

module.exports = router;