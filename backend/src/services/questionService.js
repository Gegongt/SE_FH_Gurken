const questionRepository = require("../repositories/questionRepository");
const examRepository = require("../repositories/examRepository");

function validateQuestion(q) {
  const examid = Number(q.examid);
  if (!Number.isInteger(examid) || examid <= 0) {
    return "examid must be a positive integer";
  }

  if (typeof q.question !== "string" || q.question.trim().length === 0) {
    return "question must be a non-empty string";
  }

  if (q.questiontype !== "MC_QUESTION" && q.questiontype !== "TRUE_FALSE_QUESTION") {
    return "questiontype must be 'MC_QUESTION' or 'TRUE_FALSE_QUESTION'";
  }

  if (q.questiontype === "TRUE_FALSE_QUESTION") {
    if (typeof q.istrue !== "boolean") {
      return "istrue must be boolean for TRUE_FALSE_QUESTION";
    }
  }

  if (q.questiontype === "MC_QUESTION") {
    if (!Array.isArray(q.correctanswers)) {
      return "correctanswers must be a string[] for MC_QUESTION";
    }
    if (!Array.isArray(q.wronganswers)) {
      return "wronganswers must be a string[] for MC_QUESTION";
    }
    
    if (!q.correctanswers.every(x => typeof x === "string" && x.trim().length > 0)) {
      return "correctanswers must contain non-empty strings";
    }
    if (!q.wronganswers.every(x => typeof x === "string" && x.trim().length > 0)) {
      return "wronganswers must contain non-empty strings";
    }
  }

  return null;
}

exports.createQuestions = async (dbUser, examId, questions) => {
  const exam = await examRepository.findById(examId);
  if (!exam) {
    const e = new Error("Exam not found");
    e.status = 404;
    throw e;
  }

  const isAdmin = dbUser.isadmin;
  const isCreator = exam.uid === dbUser.id;

  if (!isAdmin && !isCreator) {
    const e = new Error("Forbidden");
    e.status = 403;
    throw e;
  }

  for (const q of questions) {
    const err = validateQuestion(q);
    if (err) {
      const e = new Error(err);
      e.status = 400;
      throw e;
    }
  }

  return questionRepository.insertMany(questions.map(q => ({
    examid: Number(q.examid),
    question: q.question.trim(),
    questiontype: q.questiontype,
    istrue: q.questiontype === "TRUE_FALSE_QUESTION" ? q.istrue : null,
    correctanswers: q.questiontype === "MC_QUESTION" ? q.correctanswers.map(s => s.trim()) : null,
    wronganswers: q.questiontype === "MC_QUESTION" ? q.wronganswers.map(s => s.trim()) : null,
  })));
};

exports.getQuestionMeta = async (questionId) => {
  return questionRepository.findMetaById(questionId);
};

exports.deleteQuestionById = async (questionId) => {
  return questionRepository.deleteById(questionId);
};

exports.getExamCreatorId = async (examId) => {
  return examRepository.findCreatorIdByExamId(examId);
};

exports.deleteQuestionsByExamId = async (examId) => {
  return questionRepository.deleteByExamId(examId);
};

exports.getQuestionsByExamId = async (examId) => {
  return questionRepository.findByExamId(examId);
};