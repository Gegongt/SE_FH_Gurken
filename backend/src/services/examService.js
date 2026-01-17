const examRepository = require("../repositories/examRepository");

function mapRow(row) {
  return {
    id: row.id,
    subcategoryid: row.subcategoryid,
    name: row.name,
    creator: {
      id: row.uid,
      email: row.email,
      name: row.uname,
      isadmin: row.isadmin,
      isblocked: row.isblocked,
      profilepicturename: row.profilepicturename,
    },
  };
}

exports.createExam = async ({ subcategoryId, name, creatorId }) => {
  return examRepository.createExam(subcategoryId, name, creatorId);
};

exports.getAllExams = async () => {
  const rows = await examRepository.findAll();
  return rows.map(mapRow);
};

exports.getExamsBySubcategoryId = async (subcategoryId) => {
  const rows = await examRepository.findBySubcategoryId(subcategoryId);
  return rows.map(mapRow);
};

exports.updateExam = async (examId, name) => {
  return examRepository.updateById(examId, name);
};

exports.deleteExam = async (examId) => {
  return examRepository.deleteById(examId);
};

exports.getExamById = async (examId) => {
  const row = await examRepository.findById(examId);
  return row ? mapRow(row) : null;
};