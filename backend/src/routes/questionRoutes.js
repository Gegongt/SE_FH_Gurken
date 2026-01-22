const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");
const requireVerifiedEmail = require("../middlewares/requireVerifiedEmail")
const questionController = require("../controllers/questionController");

/**
 * @swagger
 * /questions:
 *   post:
 *     tags: [Question]
 *     summary: Create questions (batch)
 *     description: >
 *       Creates multiple questions for an exam in one request.
 *       Body must be an array of questions. All questions must belong to the same `examid`.
 *       QuestionType can be `MC_QUESTION` or `TRUE_FALSE_QUESTION`.
 *       For `TRUE_FALSE_QUESTION`, `istrue` is required.
 *       For `MC_QUESTION`, `correctanswers` and `wronganswers` are required.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             minItems: 1
 *             items:
 *               oneOf:
 *                 - type: object
 *                   required: [examid, question, questiontype, istrue]
 *                   properties:
 *                     examid:
 *                       type: integer
 *                       example: 5
 *                     question:
 *                       type: string
 *                       example: "2+2=4?"
 *                     questiontype:
 *                       type: string
 *                       enum: [TRUE_FALSE_QUESTION]
 *                     istrue:
 *                       type: boolean
 *                       example: true
 *                 - type: object
 *                   required: [examid, question, questiontype, correctanswers, wronganswers]
 *                   properties:
 *                     examid:
 *                       type: integer
 *                       example: 5
 *                     question:
 *                       type: string
 *                       example: "Welche sind Primzahlen?"
 *                     questiontype:
 *                       type: string
 *                       enum: [MC_QUESTION]
 *                     correctanswers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["2", "3"]
 *                     wronganswers:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["4", "6"]
 *     responses:
 *       201:
 *         description: Questions created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   examid:
 *                     type: integer
 *                     example: 5
 *                   question:
 *                     type: string
 *                     example: "2+2=4?"
 *                   questiontype:
 *                     type: string
 *                     enum: [MC_QUESTION, TRUE_FALSE_QUESTION]
 *                     example: "TRUE_FALSE_QUESTION"
 *                   istrue:
 *                     type: boolean
 *                     nullable: true
 *                     example: true
 *                   correctanswers:
 *                     type: array
 *                     nullable: true
 *                     items:
 *                       type: string
 *                     example: null
 *                   wronganswers:
 *                     type: array
 *                     nullable: true
 *                     items:
 *                       type: string
 *                     example: null
 *       400:
 *         description: Invalid body (missing fields / invalid questiontype / mixed examid)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user or not exam creator/admin)
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 */
router.post("/", requireAuth, checkBlocked, requireVerifiedEmail, questionController.createMany);

/**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     tags: [Question]
 *     summary: Delete a question by id (exam creator or admin)
 *     description: Deletes a single question. Only the exam creator or an admin can delete it.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Question id
 *         example: 10
 *     responses:
 *       204:
 *         description: Question deleted
 *       400:
 *         description: Invalid questionId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not exam creator/admin or blocked user)
 *       404:
 *         description: Question not found (or exam not found)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /questions:
 *   delete:
 *     tags: [Question]
 *     summary: Delete all questions of an exam (exam creator or admin)
 *     description: Deletes all questions belonging to the given examId. Only the exam creator or an admin can delete them.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam id
 *         example: 5
 *     responses:
 *       204:
 *         description: Questions deleted
 *       400:
 *         description: Missing/invalid examId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not exam creator/admin or blocked user)
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:questionId", requireAuth, checkBlocked, requireVerifiedEmail, questionController.remove);
router.delete("/", requireAuth, checkBlocked, requireVerifiedEmail, questionController.removeByExam);

/**
 * @swagger
 * /questions:
 *   get:
 *     tags: [Question]
 *     summary: Get questions by exam id
 *     description: Returns all questions for the given examId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: examId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam id
 *         example: 5
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 10
 *                   examid:
 *                     type: integer
 *                     example: 5
 *                   question:
 *                     type: string
 *                     example: "2+2=4?"
 *                   questiontype:
 *                     type: string
 *                     enum: [MC_QUESTION, TRUE_FALSE_QUESTION]
 *                     example: "TRUE_FALSE_QUESTION"
 *                   istrue:
 *                     type: boolean
 *                     nullable: true
 *                     example: true
 *                   correctanswers:
 *                     type: array
 *                     nullable: true
 *                     items:
 *                       type: string
 *                     example: null
 *                   wronganswers:
 *                     type: array
 *                     nullable: true
 *                     items:
 *                       type: string
 *                     example: null
 *       400:
 *         description: Missing/invalid examId
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (blocked user)
 *       500:
 *         description: Internal server error
 */
router.get("/", requireAuth, checkBlocked, requireVerifiedEmail, questionController.listByExam);

module.exports = router;