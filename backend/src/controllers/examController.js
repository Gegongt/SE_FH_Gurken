const examService = require("../services/examService");

async function create(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }

    const { subcategoryid, name } = req.body ?? {};

    const sid = Number(subcategoryid);
    if (!Number.isInteger(sid) || sid <= 0) {
      return res.status(400).json({ message: "subcategoryid must be a positive number" });
    }

    if (!name) {
      return res.status(400).json({ message: "name is missing" });
    }

    const created = await examService.createExam({
      subcategoryId: sid,
      name: name.trim(),
      creatorId: dbUser.id,
    });

    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function list(req, res) {
  try {
    const { subcategoryId } = req.query ?? {};

    if (subcategoryId === undefined) {
        const exams = await examService.getAllExams();
        return res.status(200).json(exams);
    }

    const sid = Number(subcategoryId);
    if (!Number.isInteger(sid) || sid <= 0) {
    return res.status(400).json({ message: "subcategoryId must be a positive integer" });
    }

    const exams = await examService.getExamsBySubcategoryId(sid);
    return res.status(200).json(exams);
  } catch (err) {
    console.error("list exams error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function update(req, res) {
    try {
        const dbUser = req.dbUser
    
        if (!dbUser) {
            return res.status(500).json({ message: "dbUser missing" });
        }
        
        const examId = Number(req.params.examId);
        if (!Number.isInteger(examId) || examId <= 0) {
            return res.status(400).json({ message: "examId must be a positive number" });
        }
        
        const exam = await examService.getExamById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        const isAdmin = dbUser.isadmin;
        const isCreator = exam.creator?.id === dbUser.id;
        if (!isCreator && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { name } = req.body ?? {};

        if (!name) {
            return res.status(400).json({ message: "name is missing" });
        }

        const updated = await examService.updateExam(examId, name.trim());
        if (!updated) {
            return res.status(404).json({ message: "Exam not found" });
        }

        return res.status(200).json(updated);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function remove(req, res) {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) {
        return res.status(500).json({ message: "dbUser missing" });
    }

    const examId = Number(req.params.examId);
    if (!Number.isInteger(examId) || examId <= 0) {
      return res.status(400).json({ message: "examId must be a positive number" });
    }

    const exam = await examService.getExamById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    const isAdmin = dbUser.isadmin;
    const isCreator = exam.creator?.id === dbUser.id;
    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleted = await examService.deleteExam(examId);
    if (!deleted) {
        return res.status(404).json({ message: "Exam not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("delete exam error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { create, list, update, remove };