const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const examController = require("../controllers/examController");

/**
 * @swagger
 * /exams:
 *   post:
 *     tags: [Exam]
 *     summary: Create an exam
 *     description: Creates a new exam. The `creatorId` is taken from the authenticated user and cannot be set by the client.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subcategoryid
 *               - name
 *             properties:
 *               subcategoryid:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string
 *                 example: "Klausur WS25"
 *     responses:
 *       201:
 *         description: Exam created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 subcategoryid:
 *                   type: integer
 *                   example: 3
 *                 name:
 *                   type: string
 *                   example: "Klausur WS25"
 *                 creatorId:
 *                   type: string
 *                   example: "firebaseUid123"
 *       400:
 *         description: Missing/invalid body fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAuth, checkBlocked, examController.create);

/**
 * @swagger
 * /exams:
 *   get:
 *     tags: [Exam]
 *     summary: Get exams (optionally filtered by subcategory)
 *     description: Returns all exams. If `subcategoryId` is provided, only exams of that subcategory are returned.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: subcategoryId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter exams by subcategory id
 *         example: 3
 *     responses:
 *       200:
 *         description: List of exams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 12
 *                   subcategoryid:
 *                     type: integer
 *                     example: 3
 *                   name:
 *                     type: string
 *                     example: "Klausur WS25"
 *                   creator:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "firebaseUid123"
 *                       email:
 *                         type: string
 *                         example: "max@stud.hcw.ac.at"
 *                       name:
 *                         type: string
 *                         example: "Max Mustermann"
 *                       isadmin:
 *                         type: boolean
 *                         example: false
 *                       isblocked:
 *                         type: boolean
 *                         example: false
 *                       profilepicturename:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *       400:
 *         description: Invalid subcategoryid (must be a positive integer)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, examController.list);

/**
 * @swagger
 * /exams/{examId}:
 *   put:
 *     tags: [Exam]
 *     summary: Update an exam (creator or admin)
 *     description: Updates an exam. Only the creator of the exam or an admin can update it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam id
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subcategoryid
 *               - name
 *             properties:
 *               subcategoryid:
 *                 type: integer
 *                 example: 3
 *               name:
 *                 type: string
 *                 example: "Klausur WS25 - Updated"
 *     responses:
 *       200:
 *         description: Exam updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 subcategoryId:
 *                   type: integer
 *                   example: 3
 *                 name:
 *                   type: string
 *                   example: "Klausur WS25 - Updated"
 *                 creator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "firebaseUid123"
 *                     email:
 *                       type: string
 *                       example: "max@stud.hcw.ac.at"
 *                     name:
 *                       type: string
 *                       example: "Max Mustermann"
 *                     isadmin:
 *                       type: boolean
 *                       example: false
 *                     isblocked:
 *                       type: boolean
 *                       example: false
 *                     profilepicturename:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *       400:
 *         description: Invalid examId/subcategoryid or missing name
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not creator, not admin)
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     tags: [Exam]
 *     summary: Delete an exam (creator or admin)
 *     description: Deletes an exam. Only the creator of the exam or an admin can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam id
 *         example: 12
 *     responses:
 *       204:
 *         description: Exam deleted
 *       400:
 *         description: Invalid examId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not creator, not admin)
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 */
router.put("/:examId", requireAuth, checkBlocked, examController.update);
router.delete("/:examId", requireAuth, checkBlocked, examController.remove);

module.exports = router;