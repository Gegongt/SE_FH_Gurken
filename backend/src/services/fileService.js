const fileRepository = require("../repositories/fileRepository");

const path = require("path");
const fs = require("fs/promises");

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

exports.getFileById = async (fileId) => {
  return fileRepository.findById(fileId);
};

exports.updateFile = async (fileId, name, isReported) => {
  return fileRepository.updateById(fileId, name, isReported);
};

exports.deleteFileEverywhere = async (fileId) => {
  const deleted = await fileRepository.deleteById(fileId);

  if (deleted) {
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "files",
      String(fileId),
    );
    try {
      await fs.unlink(filePath);
    } catch (e) {
      if (e && e.code !== "ENOENT") {
        console.warn("Failed to delete uploaded file:", e);
      }
    }
  }

  return deleted;
};

exports.reportFile = async (fileId) => {
  return fileRepository.setReportedTrue(fileId);
};
