const fileRepository = require("../repositories/fileRepository");

function mapRow(row) {
  return {
    id: row.id,
    subcategoryid: row.subcategoryid,
    name: row.name,
    isreported: row.isreported,
    uploader: {
      id: row.uid,
      email: row.email,
      name: row.uname,
      isadmin: row.isadmin,
      isblocked: row.isblocked,
      profilepicturename: row.profilepicturename,
    },
  };
}

exports.createFile = async ({ subcategoryId, name, uploaderId }) => {
  return fileRepository.insert(subcategoryId, name, uploaderId);
};

exports.getAllFiles = async () => {
  const rows = await fileRepository.findAll();
  return rows.map(mapRow);
};

exports.getFilesBySubcategoryId = async (subcategoryId) => {
  const rows = await fileRepository.findBySubcategoryId(subcategoryId);
  return rows.map(mapRow);
};

exports.getFilesByReported = async (reported) => {
  const rows = await fileRepository.findByReported(reported);
  return rows.map(mapRow);
};