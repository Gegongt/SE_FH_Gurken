const questionService = require("../services/questionService");

async function createMany(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }

    const questions = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Body must be a non-empty array of questions" });
    }

    const examId = Number(questions[0]?.examid);
    if (!Number.isInteger(examId) || examId <= 0) {
      return res.status(400).json({ message: "examid must be a positive number" });
    }

    for (const q of questions) {
      if (Number(q?.examid) !== examId) {
        return res.status(400).json({ message: "All questions must have the same examid" });
      }
    }

    const created = await questionService.createQuestions(dbUser, examId, questions);
    return res.status(201).json(created);
  } catch (err) {
    console.error("create questions error:", err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }
    
    const questionId = Number(req.params.questionId);
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return res.status(400).json({ message: "questionId must be a positive number" });
    }

    const meta = await questionService.getQuestionMeta(questionId);
    if (!meta) {
        return res.status(404).json({ message: "Question not found" });
    }

    const isAdmin = dbUser.isadmin;
    const isCreator = meta.creatorid === dbUser.id;
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await questionService.deleteQuestionById(questionId);
    if (!deleted) {
        return res.status(404).json({ message: "Question not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("delete question error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function removeByExam(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }

    const { examId } = req.query ?? {};
    if (examId === undefined) {
      return res.status(400).json({ message: "examId query param is required" });
    }

    const eid = Number(examId);
    if (!Number.isInteger(eid) || eid <= 0) {
      return res.status(400).json({ message: "examId must be a positive number" });
    }

    const creatorId = await questionService.getExamCreatorId(eid);
    if (!creatorId) {
        return res.status(404).json({ message: "Exam not found" });
    }

    const isAdmin = dbUser.isadmin;
    const isCreator = creatorId === dbUser.id;
    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await questionService.deleteQuestionsByExamId(eid);
    return res.status(204).send();
  } catch (err) {
    console.error("delete questions by exam error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function listByExam(req, res) {
  try {
    const { examId } = req.query ?? {};
    if (examId === undefined) {
      return res.status(400).json({ message: "examId query param is required" });
    }

    const eid = Number(examId);
    if (!Number.isInteger(eid) || eid <= 0) {
      return res.status(400).json({ message: "examId must be a positive number" });
    }

    const questions = await questionService.getQuestionsByExamId(eid);
    return res.status(200).json(questions);
  } catch (err) {
    console.error("list questions error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createMany, remove, removeByExam, listByExam};